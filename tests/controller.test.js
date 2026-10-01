import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createModel, emptyContactDraft } from '../src/model.js';
import { createController, getNextId } from '../src/controller.js';
import { contactsPageView, getGroupsForContact, getContactsForGroup } from '../src/view.js';

// Vitest kjører i Node, uten document, window eller simulert DOM.
let model, actions, updateView;
beforeEach(() => {
    model = createModel();
    updateView = vi.fn();
    actions = createController(model, updateView);
});

describe('Kontakter og arbeidsutkast', () => {
    it('oppretter kontakt nummer fire med egne medlemskap og ny array', () => {
        const oldContacts = model.data.contacts;
        actions.startNewContact();
        Object.assign(model.viewState.editContactPage, {
            name: ' Kari ', phone: '99999999', email: 'kari@example.com', selectedGroupIds: [2, 3],
        });
        actions.saveContact();
        expect(model.data.contacts).toHaveLength(4);
        expect(model.data.contacts[3]).toEqual({ id: 4, name: 'Kari', phone: '99999999', email: 'kari@example.com' });
        expect(oldContacts).toHaveLength(3);
        expect(model.data.contacts).not.toBe(oldContacts);
        expect(model.data.memberships.filter(row => row.contactId === 4)).toEqual([
            { contactId: 4, groupId: 2 }, { contactId: 4, groupId: 3 },
        ]);
        expect(model.viewState.editContactPage).toEqual(emptyContactDraft());
        expect(model.app.currentPage).toBe('contactsPage');
        expect(updateView).toHaveBeenCalledTimes(2);
    });

    it('redigerer et utkast og forkaster det uten å endre domenedata', () => {
        const original = structuredClone(model.data);
        const oldData = model.data;
        actions.startEditContact(1);
        expect(model.viewState.editContactPage.selectedGroupIds).toEqual([1, 3]);
        model.viewState.editContactPage.name = 'Endret navn';
        actions.toggleGroupForEditedContact(1);
        expect(model.data).toEqual(original);
        actions.cancelEditContact();
        expect(model.data).toBe(oldData);
        expect(model.data).toEqual(original);
        expect(model.viewState.editContactPage).toEqual(emptyContactDraft());
        expect(model.app.currentPage).toBe('contactsPage');
    });

    it('erstatter kontakt og medlemskap, men bevarer gamle objekter og andre kontakter', () => {
        const oldContacts = model.data.contacts;
        const oldMemberships = model.data.memberships;
        const snapshot = structuredClone(model.data);
        actions.startEditContact(1);
        model.viewState.editContactPage.name = 'Terje Hansen';
        actions.toggleGroupForEditedContact(1);
        actions.toggleGroupForEditedContact(2);
        actions.saveContact();
        expect(model.data.contacts[0].name).toBe('Terje Hansen');
        expect(model.data.contacts[0]).not.toBe(oldContacts[0]);
        expect(model.data.contacts[1]).toBe(oldContacts[1]);
        expect(oldContacts).toEqual(snapshot.contacts);
        expect(oldMemberships).toEqual(snapshot.memberships);
        expect(model.data.memberships).not.toBe(oldMemberships);
        expect(model.data.memberships).toEqual([
            { contactId: 2, groupId: 2 }, { contactId: 1, groupId: 3 }, { contactId: 1, groupId: 2 },
        ]);
        expect(updateView).toHaveBeenCalledTimes(4);
    });

    it('sletter etter ID i en annen rekkefølge og fjerner kun kontaktens medlemskap', () => {
        model.data.contacts = [...model.data.contacts].reverse();
        const oldContacts = model.data.contacts;
        const oldMemberships = model.data.memberships;
        actions.deleteContact(1);
        expect(model.data.contacts.map(contact => contact.id)).toEqual([3, 2]);
        expect(model.data.memberships).toEqual([{ contactId: 2, groupId: 2 }]);
        expect(oldContacts).toHaveLength(3);
        expect(oldMemberships).toHaveLength(3);
        expect(updateView).toHaveBeenCalledOnce();
    });

    it('nullstiller forrige utkast når en ny kontakt startes', () => {
        actions.startEditContact(1);
        actions.startNewContact();
        expect(model.viewState.editContactPage).toEqual(emptyContactDraft());
        expect(model.app.currentPage).toBe('editContactPage');
    });

    it('lagrer ikke et navn som bare inneholder mellomrom', () => {
        actions.startNewContact();
        model.viewState.editContactPage.name = '   ';
        actions.saveContact();
        expect(model.data.contacts).toHaveLength(3);
        expect(model.app.currentPage).toBe('editContactPage');
    });
});

it('oppretter gruppe med unik ID og nullstiller input', () => {
    const oldGroups = model.data.groups;
    actions.goToGroupsPage();
    model.viewState.groupsPage.newGroupName = ' Brettspill ';
    actions.createGroup();
    expect(model.data.groups.at(-1)).toEqual({ id: 4, name: 'Brettspill' });
    expect(oldGroups).toHaveLength(3);
    expect(model.data.groups).not.toBe(oldGroups);
    expect(model.viewState.groupsPage.newGroupName).toBe('');
    expect(model.app.currentPage).toBe('groupsPage');
    actions.createGroup();
    expect(model.data.groups).toHaveLength(4);
    actions.goToContactsPage();
    expect(model.app.currentPage).toBe('contactsPage');
});

it('beregner ID fra høyeste ID, også med hull eller tom liste', () => {
    expect(getNextId([])).toBe(1);
    expect(getNextId([{ id: 8 }, { id: 2 }])).toBe(9);
});

it('beregner relasjoner og søketreff uten å endre modellen', () => {
    model.viewState.contactsPage.searchText = 'PÅL';
    const original = structuredClone(model);
    expect(getGroupsForContact(model, 1).map(group => group.name)).toEqual(['Sykling', 'Reising']);
    expect(getContactsForGroup(model, 2).map(contact => contact.name)).toEqual(['Per']);
    const html = contactsPageView(model);
    expect(html).toContain('<h2>Pål</h2>');
    expect(html).not.toContain('<h2>Terje</h2>');
    expect(model).toEqual(original);
});

it('viser brukerinput som tekst, ikke kjørbar HTML', () => {
    model.data.contacts[0] = { ...model.data.contacts[0], name: '<img src=x onerror="alert(1)">' };
    const html = contactsPageView(model);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).toContain('&quot;');
});
