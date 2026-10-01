function clearEditContactViewState() {
    const ViewState = model.viewState.editContactPage;
    ViewState.contactId = null;
    ViewState.name = '';
    ViewState.phone = '';
    ViewState.email = '';
    ViewState.selectedGroupIds = [];
}

function startNewContact() {
    clearEditContactViewState();
    model.app.currentPage = 'editContactPage';
    updateView();
}

function startEditContact(contactId) {
    const contact = findObjectById(model.contacts, contactId);
    if (contact === null) return;

    const ViewState = model.viewState.editContactPage;
    // PRINSIPP: viewState er arbeidsutkastet. model.contacts er lagrede data.
    // Vi kopierer feltene; domenedata endres først når brukeren trykker Lagre.
    ViewState.contactId = contact.id;
    ViewState.name = contact.name;
    ViewState.phone = contact.phone;
    ViewState.email = contact.email;
    ViewState.selectedGroupIds = [];
    for (let membership of model.memberships) {
        if (membership.contactId === contactId) {
            ViewState.selectedGroupIds.push(membership.groupId);
        }
    }
    model.app.currentPage = 'editContactPage';
    updateView();
}

function toggleGroupForEditedContact(groupId) {
    const ViewState = model.viewState.editContactPage;
    const selectedIds = ViewState.selectedGroupIds;
    const newSelectedIds = [];
    for (let id of selectedIds) {
        if (id !== groupId) {
            newSelectedIds.push(id);
        }
    }
    if (!selectedIds.includes(groupId)) {
        newSelectedIds.push(groupId);
    }
    ViewState.selectedGroupIds = newSelectedIds;
    // Avkrysningen vises allerede av nettleseren. Vi oppdaterer bare utkastet.
}

function saveContact() {
    const ViewState = model.viewState.editContactPage;
    if (ViewState.name.trim() === '') return;

    let contactId = ViewState.contactId;
    if (contactId === null) {
        contactId = getNextId(model.contacts);
    }
    const updatedContact = {
        id: contactId,
        name: ViewState.name.trim(),
        phone: ViewState.phone.trim(),
        email: ViewState.email.trim(),
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
    if (ViewState.contactId === null) {
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
    for (let groupId of ViewState.selectedGroupIds) {
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
