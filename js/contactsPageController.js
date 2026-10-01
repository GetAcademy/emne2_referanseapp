function goToContactsPage() {
    clearEditContactViewState();
    Model.app.currentPage = 'contactsPage';
    updateView();
}

// Controlleren kjenner bare modellen og updateView, ikke DOM eller HTML.
function deleteContact(contactId) {
    const newContacts = [];
    // ID identifiserer kontakten også etter søk. Indeks er bare plassering.
    for (let contact of Model.contacts) {
        if (contact.id !== contactId) {
            newContacts.push(contact);
        }
    }
    Model.contacts = newContacts;

    const newMemberships = [];
    for (let membership of Model.memberships) {
        if (membership.contactId !== contactId) {
            newMemberships.push(membership);
        }
    }
    Model.memberships = newMemberships;
    updateView();
}
