let updateViewCalls = 0;

// Erstatter tegningen i testmiljøet. Controllerne trenger ingen app-DOM.
function updateView() {
    updateViewCalls++;
}

function resetTestModel() {
    model.app.currentPage = 'contactsPage';
    model.viewState.contactsPage.searchText = '';
    model.viewState.groupsPage.newGroupName = '';
    clearEditContactViewState();
    model.contacts = [
        { id: 1, name: 'Terje', phone: '12345678', email: 'terje@example.com' },
        { id: 2, name: 'Per', phone: '87654321', email: 'per@example.com' },
        { id: 3, name: 'Pål', phone: '11223344', email: 'paal@example.com' },
    ];
    model.groups = [
        { id: 1, name: 'Sykling' }, { id: 2, name: 'Konsert' }, { id: 3, name: 'Reising' },
    ];
    model.memberships = [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ];
    updateViewCalls = 0;
}

QUnit.module('Modell og controllere', { beforeEach: resetTestModel });

QUnit.test('Opprett kontakt med to medlemskap', function (assert) {
    const viewState = model.viewState.editContactPage;
    startNewContact();
    viewState.name = ' Kari ';
    viewState.phone = ' 99999999 ';
    viewState.email = ' kari@example.com ';
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(2);
    saveContact();
    assert.strictEqual(model.contacts.length, 4, 'Antallet øker fra tre til fire');
    assert.deepEqual(findObjectById(model.contacts, 4), {
        id: 4, name: 'Kari', phone: '99999999', email: 'kari@example.com',
    });
    assert.deepEqual(getGroupsForContact(4), [model.groups[0], model.groups[1]]);
    const savedContact = findObjectById(model.contacts, 4);
    assert.notStrictEqual(savedContact, viewState, 'Lagret kontakt og arbeidsutkast er separate objekter');
    assert.deepEqual(model.memberships, [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
        { contactId: 4, groupId: 1 }, { contactId: 4, groupId: 2 },
    ]);
    assert.notStrictEqual(model.memberships[3], model.memberships[4], 'Hver relasjon har sitt eget objekt');
    assert.strictEqual(viewState.contactId, null);
    assert.strictEqual(viewState.name, '');
    assert.strictEqual(model.app.currentPage, 'contactsPage');
    assert.strictEqual(updateViewCalls, 2, 'Oppstart og lagring tegner, gruppevalg endrer bare state');
    viewState.name = 'Et nytt utkast';
    viewState.phone = '';
    viewState.email = '';
    viewState.selectedGroupIds.push(3);
    assert.deepEqual(savedContact, {
        id: 4, name: 'Kari', phone: '99999999', email: 'kari@example.com',
    }, 'Videre endringer i utkastet endrer ikke den lagrede kontakten');
    assert.deepEqual(getGroupsForContact(4), [model.groups[0], model.groups[1]]);
});

QUnit.test('Rediger riktig kontakt og erstatt medlemskap', function (assert) {
    model.contacts = [model.contacts[1], model.contacts[2], model.contacts[0]];
    const viewState = model.viewState.editContactPage;
    const oldContact = findObjectById(model.contacts, 1);
    startEditContact(1);
    assert.deepEqual(viewState.selectedGroupIds, [1, 3]);
    viewState.name = ' Terje Hansen ';
    viewState.phone = ' 55555555 ';
    viewState.email = ' hansen@example.com ';
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(2);
    assert.strictEqual(oldContact.name, 'Terje', 'Utkastet endrer ikke lagret kontakt');
    saveContact();
    assert.deepEqual(findObjectById(model.contacts, 1), {
        id: 1, name: 'Terje Hansen', phone: '55555555', email: 'hansen@example.com',
    });
    assert.strictEqual(model.contacts.length, 3, 'Redigering oppretter ingen ekstra kontakt');
    assert.deepEqual(findObjectById(model.contacts, 2), {
        id: 2, name: 'Per', phone: '87654321', email: 'per@example.com',
    }, 'Andre kontakter beholder opplysningene sine');
    assert.deepEqual(model.memberships, [
        { contactId: 2, groupId: 2 }, { contactId: 1, groupId: 3 }, { contactId: 1, groupId: 2 },
    ]);
});

QUnit.test('Avbryt forkaster hele utkastet uten å endre domenedata', function (assert) {
    const viewState = model.viewState.editContactPage;
    startEditContact(1);
    viewState.name = 'Forkastes';
    viewState.phone = '00000000';
    viewState.email = 'forkastes@example.com';
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(2);
    cancelEditContact();
    assert.deepEqual(model.contacts, [
        { id: 1, name: 'Terje', phone: '12345678', email: 'terje@example.com' },
        { id: 2, name: 'Per', phone: '87654321', email: 'per@example.com' },
        { id: 3, name: 'Pål', phone: '11223344', email: 'paal@example.com' },
    ], 'Avbryt beholder alle lagrede kontaktopplysninger');
    assert.deepEqual(model.memberships, [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ], 'Avbryt beholder medlemskapene');
    assert.deepEqual(viewState, {
        contactId: null, name: '', phone: '', email: '', selectedGroupIds: [],
    });
    assert.strictEqual(model.app.currentPage, 'contactsPage');
});

QUnit.test('Slett bruker ID og fjerner kontaktens medlemskap', function (assert) {
    model.contacts = [model.contacts[2], model.contacts[0], model.contacts[1]];
    deleteContact(1);
    assert.strictEqual(findObjectById(model.contacts, 1), null);
    assert.strictEqual(model.contacts.length, 2);
    assert.strictEqual(model.contacts[0].id, 3);
    assert.strictEqual(model.contacts[1].id, 2);
    assert.deepEqual(model.memberships, [{ contactId: 2, groupId: 2 }]);
    assert.strictEqual(updateViewCalls, 1);
});

QUnit.test('Sletting av ukjent ID fjerner ikke siste kontakt', function (assert) {
    deleteContact(99);
    assert.strictEqual(model.contacts.length, 3);
    assert.strictEqual(model.contacts[2].id, 3);
    assert.strictEqual(model.memberships.length, 3);
});

QUnit.test('Opprett gruppe med ny ID og nullstill input', function (assert) {
    const viewState = model.viewState.groupsPage;
    viewState.newGroupName = ' Brettspill ';
    createGroup();
    assert.strictEqual(model.groups.length, 4);
    assert.deepEqual(findObjectById(model.groups, 4), { id: 4, name: 'Brettspill' });
    assert.strictEqual(viewState.newGroupName, '');
    assert.deepEqual(model.groups[0], { id: 1, name: 'Sykling' });
    assert.strictEqual(updateViewCalls, 1);
});

QUnit.test('Ny kontakt og navigasjon nullstiller gamle utkast', function (assert) {
    const viewState = model.viewState.editContactPage;
    startEditContact(1);
    startNewContact();
    assert.strictEqual(model.app.currentPage, 'editContactPage');
    assert.deepEqual(viewState, {
        contactId: null, name: '', phone: '', email: '', selectedGroupIds: [],
    });
    viewState.name = 'Ulagret';
    goToGroupsPage();
    assert.strictEqual(model.app.currentPage, 'groupsPage');
    assert.strictEqual(viewState.name, '');
    goToContactsPage();
    assert.strictEqual(model.app.currentPage, 'contactsPage');
    assert.strictEqual(model.contacts.length, 3);
});

QUnit.test('Tomme navn lagres ikke', function (assert) {
    startNewContact();
    model.viewState.editContactPage.name = '   ';
    saveContact();
    assert.strictEqual(model.contacts.length, 3);
    assert.strictEqual(model.app.currentPage, 'editContactPage');
    model.viewState.groupsPage.newGroupName = '   ';
    createGroup();
    assert.strictEqual(model.groups.length, 3);
});

QUnit.test('Finn objekt og beregn neste ID', function (assert) {
    const items = [{ id: 8, name: 'Åtte' }, { id: 2, name: 'To' }];
    assert.strictEqual(findObjectById(items, 2), items[1]);
    assert.strictEqual(findObjectById(items, 99), null);
    assert.strictEqual(getNextId(items), 9);
    assert.strictEqual(getNextId([]), 1);
});

QUnit.test('Søk og relasjoner beregnes uten å endre domenedata', function (assert) {
    const viewState = model.viewState.contactsPage;
    viewState.searchText = 'PÅL';
    assert.deepEqual(getFilteredContacts(), [model.contacts[2]]);
    viewState.searchText = '87654321';
    assert.deepEqual(getFilteredContacts(), [model.contacts[1]]);
    viewState.searchText = 'terje@example.com';
    assert.deepEqual(getFilteredContacts(), [model.contacts[0]]);
    viewState.searchText = 'Ingen treff';
    assert.deepEqual(getFilteredContacts(), []);
    assert.deepEqual(getGroupsForContact(1), [model.groups[0], model.groups[2]]);
    assert.deepEqual(getContactsForGroup(2), [model.contacts[1]]);
    assert.deepEqual(getGroupsForContact(3), []);
    assert.deepEqual(model.contacts, [
        { id: 1, name: 'Terje', phone: '12345678', email: 'terje@example.com' },
        { id: 2, name: 'Per', phone: '87654321', email: 'per@example.com' },
        { id: 3, name: 'Pål', phone: '11223344', email: 'paal@example.com' },
    ]);
    assert.deepEqual(model.groups, [
        { id: 1, name: 'Sykling' }, { id: 2, name: 'Konsert' }, { id: 3, name: 'Reising' },
    ]);
    assert.deepEqual(model.memberships, [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ]);
    assert.strictEqual(model.filteredContacts, undefined);
    assert.strictEqual(model.groupsForContact, undefined);
    assert.strictEqual(model.contactsForGroup, undefined);
});

QUnit.test('Gruppevalg kan legges til og fjernes uten å endre lagrede medlemskap', function (assert) {
    startEditContact(1);
    toggleGroupForEditedContact(1);
    assert.deepEqual(model.viewState.editContactPage.selectedGroupIds, [3]);
    toggleGroupForEditedContact(1);
    assert.deepEqual(model.viewState.editContactPage.selectedGroupIds, [3, 1]);
    toggleGroupForEditedContact(1);
    assert.deepEqual(model.viewState.editContactPage.selectedGroupIds, [3]);
    assert.deepEqual(model.memberships, [
        { contactId: 1, groupId: 1 }, { contactId: 1, groupId: 3 }, { contactId: 2, groupId: 2 },
    ]);
});

QUnit.test('Lagre uten valgte grupper fjerner alle kontaktens medlemskap', function (assert) {
    startEditContact(1);
    toggleGroupForEditedContact(1);
    toggleGroupForEditedContact(3);
    saveContact();
    assert.strictEqual(model.contacts.length, 3);
    assert.deepEqual(getGroupsForContact(1), []);
    assert.deepEqual(model.memberships, [{ contactId: 2, groupId: 2 }]);
});
