function goToContactsPage() {
    clearEditContactViewState();
    model.app.currentPage = 'contactsPage';
    updateView();
}

// Controlleren kjenner bare modellen og updateView, ikke DOM eller HTML.
function deleteContact(contactId) {
    const newContacts = [];
    // ID identifiserer kontakten også etter søk. Indeks er bare plassering.
    for (let contact of model.contacts) {
        if (contact.id !== contactId) {
            newContacts.push(contact);
        }
    }
    model.contacts = newContacts;

    const newMemberships = [];
    for (let membership of model.memberships) {
        if (membership.contactId !== contactId) {
            newMemberships.push(membership);
        }
    }
    model.memberships = newMemberships;
    updateView();
}
