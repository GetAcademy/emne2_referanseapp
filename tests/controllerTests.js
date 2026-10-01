let updateViewCalls = 0;

// Erstatter tegningen i testmiljøet. Controllerne trenger ingen app-DOM.
function updateView() {
    updateViewCalls++;
}

function resetTestModel() {
    Model.app.currentPage = 'contactsPage';
    Model.ViewState.contactsPage.searchText = '';
    Model.ViewState.groupsPage.newGroupName = '';
    clearEditContactViewState();
    Model.contacts = [
        { id: 1, name: 'Terje', phone: '12345678', email: 'terje@example.com' },
        { id: 2, name: 'Per', phone: '87654321', email: 'per@example.com' },
        { id: 3, name: 'Pål', phone: '11223344', email: 'paal@example.com' },
    ];
    Model.groups = [
        { id: 1, name: 'Sykling' }, { id: 2, name: 'Konsert' }, { id: 3, name: 'Reising' },
    ];
    Model.memberships = [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ];
    updateViewCalls = 0;
}

QUnit.module('Modell og controllere', { beforeEach: resetTestModel });

QUnit.test('Opprett kontakt med to medlemskap', function (assert) {
    const oldContacts = Model.contacts;
    const oldMemberships = Model.memberships;
    startNewContact();
    Model.ViewState.editContactPage.name = 'Kari';
    Model.ViewState.editContactPage.phone = '99999999';
    Model.ViewState.editContactPage.email = 'kari@example.com';
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(2);
    saveContact();
    assert.strictEqual(Model.contacts.length, 4, 'Antallet øker fra tre til fire');
    assert.deepEqual(findObjectById(Model.contacts, 4), {
        id: 4, name: 'Kari', phone: '99999999', email: 'kari@example.com',
    });
    assert.deepEqual(getGroupsForContact(4), [Model.groups[0], Model.groups[1]]);
    assert.strictEqual(oldContacts.length, 3, 'Den gamle kontaktlisten er urørt');
    assert.strictEqual(oldMemberships.length, 3, 'Den gamle relasjonslisten er urørt');
    assert.notStrictEqual(Model.contacts, oldContacts);
    assert.notStrictEqual(Model.memberships, oldMemberships);
    assert.strictEqual(Model.ViewState.editContactPage.contactId, null);
    assert.strictEqual(Model.ViewState.editContactPage.name, '');
    assert.strictEqual(Model.app.currentPage, 'contactsPage');
    assert.strictEqual(updateViewCalls, 4, 'Handlingene ber om ny tegning');
});

QUnit.test('Rediger riktig kontakt og erstatt medlemskap', function (assert) {
    const oldContacts = Model.contacts;
    const oldMemberships = Model.memberships;
    const oldContact = findObjectById(Model.contacts, 1);
    const otherContact = findObjectById(Model.contacts, 2);
    startEditContact(1);
    assert.deepEqual(Model.ViewState.editContactPage.selectedGroupIds, [1, 3]);
    Model.ViewState.editContactPage.name = 'Terje Hansen';
    Model.ViewState.editContactPage.phone = '55555555';
    Model.ViewState.editContactPage.email = 'hansen@example.com';
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(2);
    assert.strictEqual(oldContact.name, 'Terje', 'Utkastet endrer ikke lagret kontakt');
    saveContact();
    assert.deepEqual(findObjectById(Model.contacts, 1), {
        id: 1, name: 'Terje Hansen', phone: '55555555', email: 'hansen@example.com',
    });
    assert.strictEqual(findObjectById(Model.contacts, 2), otherContact);
    assert.notStrictEqual(findObjectById(Model.contacts, 1), oldContact);
    assert.notStrictEqual(Model.contacts, oldContacts);
    assert.deepEqual(Model.memberships, [
        { contactId: 2, groupId: 2 }, { contactId: 1, groupId: 3 }, { contactId: 1, groupId: 2 },
    ]);
    assert.deepEqual(oldMemberships, [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ]);
    assert.strictEqual(oldContact.name, 'Terje');
});

QUnit.test('Avbryt forkaster hele utkastet uten å endre domenedata', function (assert) {
    const oldContacts = Model.contacts;
    const oldMemberships = Model.memberships;
    startEditContact(1);
    Model.ViewState.editContactPage.name = 'Forkastes';
    toggleGroupForEditedContact(2);
    cancelEditContact();
    assert.strictEqual(Model.contacts, oldContacts);
    assert.strictEqual(Model.memberships, oldMemberships);
    assert.strictEqual(Model.contacts[0].name, 'Terje');
    assert.deepEqual(Model.ViewState.editContactPage, {
        contactId: null, name: '', phone: '', email: '', selectedGroupIds: [],
    });
    assert.strictEqual(Model.app.currentPage, 'contactsPage');
});

QUnit.test('Slett bruker ID og fjerner kontaktens medlemskap', function (assert) {
    Model.contacts = [Model.contacts[2], Model.contacts[0], Model.contacts[1]];
    const oldContacts = Model.contacts;
    const oldMemberships = Model.memberships;
    deleteContact(1);
    assert.strictEqual(findObjectById(Model.contacts, 1), null);
    assert.strictEqual(Model.contacts.length, 2);
    assert.strictEqual(Model.contacts[0].id, 3);
    assert.strictEqual(Model.contacts[1].id, 2);
    assert.deepEqual(Model.memberships, [{ contactId: 2, groupId: 2 }]);
    assert.strictEqual(oldContacts.length, 3);
    assert.strictEqual(oldMemberships.length, 3);
    assert.strictEqual(updateViewCalls, 1);
});

QUnit.test('Opprett gruppe med ny ID og nullstill input', function (assert) {
    const oldGroups = Model.groups;
    Model.ViewState.groupsPage.newGroupName = 'Brettspill';
    createGroup();
    assert.strictEqual(Model.groups.length, 4);
    assert.deepEqual(findObjectById(Model.groups, 4), { id: 4, name: 'Brettspill' });
    assert.strictEqual(Model.ViewState.groupsPage.newGroupName, '');
    assert.notStrictEqual(Model.groups, oldGroups);
    assert.strictEqual(oldGroups.length, 3);
    assert.strictEqual(updateViewCalls, 1);
});

QUnit.test('Ny kontakt og navigasjon nullstiller gamle utkast', function (assert) {
    startEditContact(1);
    startNewContact();
    assert.strictEqual(Model.app.currentPage, 'editContactPage');
    assert.deepEqual(Model.ViewState.editContactPage, {
        contactId: null, name: '', phone: '', email: '', selectedGroupIds: [],
    });
    Model.ViewState.editContactPage.name = 'Ulagret';
    goToGroupsPage();
    assert.strictEqual(Model.app.currentPage, 'groupsPage');
    assert.strictEqual(Model.ViewState.editContactPage.name, '');
    goToContactsPage();
    assert.strictEqual(Model.app.currentPage, 'contactsPage');
    assert.strictEqual(Model.contacts.length, 3);
});

QUnit.test('Tomme navn lagres ikke', function (assert) {
    startNewContact();
    Model.ViewState.editContactPage.name = '   ';
    saveContact();
    assert.strictEqual(Model.contacts.length, 3);
    assert.strictEqual(Model.app.currentPage, 'editContactPage');
    Model.ViewState.groupsPage.newGroupName = '   ';
    createGroup();
    assert.strictEqual(Model.groups.length, 3);
});

QUnit.test('Finn objekt, beregn neste ID og kopier array', function (assert) {
    const items = [{ id: 8, name: 'Åtte' }, { id: 2, name: 'To' }];
    assert.strictEqual(findObjectById(items, 2), items[1]);
    assert.strictEqual(findObjectById(items, 99), null);
    assert.strictEqual(getNextId(items), 9);
    assert.strictEqual(getNextId([]), 1);
    const copy = copyArray(items);
    assert.deepEqual(copy, items);
    assert.notStrictEqual(copy, items);
    copy.push({ id: 9, name: 'Ni' });
    assert.strictEqual(items.length, 2);
});

QUnit.test('Søk og relasjoner beregnes uten å endre domenedata', function (assert) {
    const contacts = Model.contacts;
    const groups = Model.groups;
    const memberships = Model.memberships;
    Model.ViewState.contactsPage.searchText = 'PÅL';
    assert.deepEqual(getFilteredContacts(), [Model.contacts[2]]);
    Model.ViewState.contactsPage.searchText = '87654321';
    assert.deepEqual(getFilteredContacts(), [Model.contacts[1]]);
    Model.ViewState.contactsPage.searchText = 'terje@example.com';
    assert.deepEqual(getFilteredContacts(), [Model.contacts[0]]);
    Model.ViewState.contactsPage.searchText = 'Ingen treff';
    assert.deepEqual(getFilteredContacts(), []);
    assert.deepEqual(getGroupsForContact(1), [Model.groups[0], Model.groups[2]]);
    assert.deepEqual(getContactsForGroup(2), [Model.contacts[1]]);
    assert.deepEqual(getGroupsForContact(3), []);
    assert.strictEqual(Model.contacts, contacts);
    assert.strictEqual(Model.groups, groups);
    assert.strictEqual(Model.memberships, memberships);
    assert.strictEqual(Model.filteredContacts, undefined);
});

QUnit.test('HTML-tegn vises som tekst', function (assert) {
    assert.strictEqual(escapeHtml('<b>"A&B"</b>'), '&lt;b&gt;&quot;A&amp;B&quot;&lt;/b&gt;');
    assert.strictEqual(escapeHtml("O'Brian"), 'O&#39;Brian');
});
