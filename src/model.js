export function emptyContactDraft() {
    return { contactId: null, name: '', phone: '', email: '', selectedGroupIds: [] };
}

// En ny modell per oppstart/test hindrer at testene deler state.
export function createModel() {
    return {
        app: { currentPage: 'contactsPage' },
        viewState: {
            contactsPage: { searchText: '' },
            editContactPage: emptyContactDraft(),
            groupsPage: { newGroupName: '' },
        },
        data: {
            contacts: [
                { id: 1, name: 'Terje', phone: '12345678', email: 'terje@example.com' },
                { id: 2, name: 'Per', phone: '87654321', email: 'per@example.com' },
                { id: 3, name: 'Pål', phone: '11223344', email: 'paal@example.com' },
            ],
            groups: [
                { id: 1, name: 'Sykling' },
                { id: 2, name: 'Konsert' },
                { id: 3, name: 'Reising' },
            ],
            // PRINSIPP: Relasjoner via ID. Én liste per entitetstype.
            // memberships er mange-til-mange-relasjonen. Vi lagrer ikke
            // contact.groups = [{ id: 1, name: 'Sykling' }] eller group.contacts.
            memberships: [
                { contactId: 1, groupId: 1 },
                { contactId: 1, groupId: 3 },
                { contactId: 2, groupId: 2 },
            ],
        },
    };
}
