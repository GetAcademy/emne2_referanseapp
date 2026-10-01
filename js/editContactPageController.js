function clearEditContactViewState() {
    model.viewState.editContactPage.contactId = null;
    model.viewState.editContactPage.name = '';
    model.viewState.editContactPage.phone = '';
    model.viewState.editContactPage.email = '';
    model.viewState.editContactPage.selectedGroupIds = [];
}

function startNewContact() {
    clearEditContactViewState();
    model.app.currentPage = 'editContactPage';
    updateView();
}

function startEditContact(contactId) {
    const contact = findObjectById(model.contacts, contactId);
    if (contact === null) return;

    // PRINSIPP: viewState er arbeidsutkastet. model.contacts er lagrede data.
    // Vi kopierer feltene; domenedata endres først når brukeren trykker Lagre.
    model.viewState.editContactPage.contactId = contact.id;
    model.viewState.editContactPage.name = contact.name;
    model.viewState.editContactPage.phone = contact.phone;
    model.viewState.editContactPage.email = contact.email;
    model.viewState.editContactPage.selectedGroupIds = [];
    for (let membership of model.memberships) {
        if (membership.contactId === contactId) {
            model.viewState.editContactPage.selectedGroupIds.push(membership.groupId);
        }
    }
    model.app.currentPage = 'editContactPage';
    updateView();
}

function toggleGroupForEditedContact(groupId) {
    const selectedIds = model.viewState.editContactPage.selectedGroupIds;
    const newSelectedIds = [];
    for (let id of selectedIds) {
        if (id !== groupId) {
            newSelectedIds.push(id);
        }
    }
    if (!selectedIds.includes(groupId)) {
        newSelectedIds.push(groupId);
    }
    model.viewState.editContactPage.selectedGroupIds = newSelectedIds;
    updateView();
}

function saveContact() {
    const draft = model.viewState.editContactPage;
    if (draft.name.trim() === '') return;

    let contactId = draft.contactId;
    if (contactId === null) {
        contactId = getNextId(model.contacts);
    }
    const updatedContact = {
        id: contactId,
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
    };

    // PRINSIPP: Vi bygger en ny array og et nytt kontaktobjekt.
    // push brukes på den nye arrayen, så den gamle beholder innholdet sitt.
    // Senere kan dette skrives kortere med map og spread-syntaks.
    const newContacts = [];
    for (let contact of model.contacts) {
        if (contact.id === contactId) {
            newContacts.push(updatedContact);
        } else {
            newContacts.push(contact);
        }
    }
    if (draft.contactId === null) {
        newContacts.push(updatedContact);
    }
    model.contacts = newContacts;

    // Behold andre kontakters medlemskap, og erstatt denne kontaktens koblinger.
    const newMemberships = [];
    for (let membership of model.memberships) {
        if (membership.contactId !== contactId) {
            newMemberships.push(membership);
        }
    }
    for (let groupId of draft.selectedGroupIds) {
        newMemberships.push({ contactId: contactId, groupId: groupId });
    }
    model.memberships = newMemberships;
    clearEditContactViewState();
    model.app.currentPage = 'contactsPage';
    updateView();
}

function cancelEditContact() {
    // Forkast arbeidsutkastet uten å endre domenedata.
    clearEditContactViewState();
    model.app.currentPage = 'contactsPage';
    updateView();
}
