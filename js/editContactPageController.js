function clearEditContactViewState() {
    const viewState = model.viewState.editContactPage;
    viewState.contactId = null;
    viewState.name = '';
    viewState.phone = '';
    viewState.email = '';
    viewState.selectedGroupIds = [];
}

function startNewContact() {
    clearEditContactViewState();
    model.app.currentPage = 'editContactPage';
    updateView();
}

function startEditContact(contactId) {
    const contact = findObjectById(model.contacts, contactId);
    if (contact === null) return;

    const viewState = model.viewState.editContactPage;
    // PRINSIPP: viewState er arbeidsutkastet. model.contacts er lagrede data.
    // Vi kopierer feltene; domenedata endres først når brukeren trykker Lagre.
    viewState.contactId = contact.id;
    viewState.name = contact.name;
    viewState.phone = contact.phone;
    viewState.email = contact.email;
    viewState.selectedGroupIds = [];
    for (let membership of model.memberships) {
        if (membership.contactId === contactId) {
            viewState.selectedGroupIds.push(membership.groupId);
        }
    }
    model.app.currentPage = 'editContactPage';
    updateView();
}

function toggleGroupForEditedContact(groupId) {
    const viewState = model.viewState.editContactPage;
    const selectedIds = viewState.selectedGroupIds;
    const index = selectedIds.indexOf(groupId);
    if (index === -1) {
        selectedIds.push(groupId);
    } else {
        selectedIds.splice(index, 1);
    }
    // Avkrysningen vises allerede av nettleseren. Vi oppdaterer bare utkastet.
}

function saveContact() {
    const viewState = model.viewState.editContactPage;
    if (viewState.name.trim() === '') return;

    let contactId = viewState.contactId;
    if (contactId === null) {
        // Ikke push selve viewState: utkastet og kontaktlisten ville pekt på
        // samme objekt, så nullstilling av utkastet også ville endret kontakten.
        const newContact = {
            id: getNextId(model.contacts),
            name: viewState.name.trim(),
            phone: viewState.phone.trim(),
            email: viewState.email.trim(),
        };
        model.contacts.push(newContact);
        contactId = newContact.id;
    } else {
        const contact = findObjectById(model.contacts, contactId);
        if (contact === null) return;
        contact.name = viewState.name.trim();
        contact.phone = viewState.phone.trim();
        contact.email = viewState.email.trim();
    }

    // Gå baklengs så sletting ikke hopper over medlemskap ved siden av hverandre.
    for (let i = model.memberships.length - 1; i >= 0; i--) {
        if (model.memberships[i].contactId === contactId) {
            model.memberships.splice(i, 1);
        }
    }
    for (let groupId of viewState.selectedGroupIds) {
        const membership = {
            contactId: contactId,
            groupId: groupId,
        };
        model.memberships.push(membership);
    }
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
