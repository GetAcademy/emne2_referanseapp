function clearEditContactViewState() {
    Model.ViewState.editContactPage.contactId = null;
    Model.ViewState.editContactPage.name = '';
    Model.ViewState.editContactPage.phone = '';
    Model.ViewState.editContactPage.email = '';
    Model.ViewState.editContactPage.selectedGroupIds = [];
}

function startNewContact() {
    clearEditContactViewState();
    Model.app.currentPage = 'editContactPage';
    updateView();
}

function startEditContact(contactId) {
    const contact = findObjectById(Model.contacts, contactId);
    if (contact === null) return;

    // PRINSIPP: ViewState er arbeidsutkastet. Model.contacts er lagrede data.
    // Vi kopierer feltene; domenedata endres først når brukeren trykker Lagre.
    Model.ViewState.editContactPage.contactId = contact.id;
    Model.ViewState.editContactPage.name = contact.name;
    Model.ViewState.editContactPage.phone = contact.phone;
    Model.ViewState.editContactPage.email = contact.email;
    Model.ViewState.editContactPage.selectedGroupIds = [];
    for (let membership of Model.memberships) {
        if (membership.contactId === contactId) {
            Model.ViewState.editContactPage.selectedGroupIds.push(membership.groupId);
        }
    }
    Model.app.currentPage = 'editContactPage';
    updateView();
}

function toggleGroupForEditedContact(groupId) {
    const selectedIds = Model.ViewState.editContactPage.selectedGroupIds;
    const newSelectedIds = [];
    for (let id of selectedIds) {
        if (id !== groupId) {
            newSelectedIds.push(id);
        }
    }
    if (!selectedIds.includes(groupId)) {
        newSelectedIds.push(groupId);
    }
    Model.ViewState.editContactPage.selectedGroupIds = newSelectedIds;
    updateView();
}

function saveContact() {
    const draft = Model.ViewState.editContactPage;
    if (draft.name.trim() === '') return;

    let contactId = draft.contactId;
    if (contactId === null) {
        contactId = getNextId(Model.contacts);
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
    for (let contact of Model.contacts) {
        if (contact.id === contactId) {
            newContacts.push(updatedContact);
        } else {
            newContacts.push(contact);
        }
    }
    if (draft.contactId === null) {
        newContacts.push(updatedContact);
    }
    Model.contacts = newContacts;

    // Behold andre kontakters medlemskap, og erstatt denne kontaktens koblinger.
    const newMemberships = [];
    for (let membership of Model.memberships) {
        if (membership.contactId !== contactId) {
            newMemberships.push(membership);
        }
    }
    for (let groupId of draft.selectedGroupIds) {
        newMemberships.push({ contactId: contactId, groupId: groupId });
    }
    Model.memberships = newMemberships;
    clearEditContactViewState();
    Model.app.currentPage = 'contactsPage';
    updateView();
}

function cancelEditContact() {
    // Forkast arbeidsutkastet uten å endre domenedata.
    clearEditContactViewState();
    Model.app.currentPage = 'contactsPage';
    updateView();
}
