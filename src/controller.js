import { emptyContactDraft } from './model.js';

export function getNextId(items) {
    return items.length === 0 ? 1 : Math.max(...items.map(item => item.id)) + 1;
}

// PRINSIPP: Controller kjenner ikke DOM. I appen tegner updateView HTML;
// i testene sender vi inn en testfunksjon. Ingen nettleser er nødvendig.
export function createController(model, updateView) {
    function goToContactsPage() {
        model.app.currentPage = 'contactsPage';
        updateView();
    }

    function goToGroupsPage() {
        model.app.currentPage = 'groupsPage';
        updateView();
    }

    function startNewContact() {
        model.viewState.editContactPage = emptyContactDraft();
        model.app.currentPage = 'editContactPage';
        updateView();
    }

    function startEditContact(contactId) {
        const contact = model.data.contacts.find(contact => contact.id === contactId);
        if (!contact) return;
        // PRINSIPP: View state er et arbeidsutkast. contacts er lagrede data.
        // Feltene kopieres; først ved Lagre endres data.contacts.
        model.viewState.editContactPage = {
            contactId,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            selectedGroupIds: model.data.memberships
                .filter(membership => membership.contactId === contactId)
                .map(membership => membership.groupId),
        };
        model.app.currentPage = 'editContactPage';
        updateView();
    }

    function toggleGroupForEditedContact(groupId) {
        const draft = model.viewState.editContactPage;
        model.viewState.editContactPage = {
            ...draft,
            selectedGroupIds: draft.selectedGroupIds.includes(groupId)
                ? draft.selectedGroupIds.filter(id => id !== groupId)
                : [...draft.selectedGroupIds, groupId],
        };
        updateView();
    }

    function saveContact() {
        const draft = model.viewState.editContactPage;
        if (!draft.name.trim()) return;
        const contactId = draft.contactId ?? getNextId(model.data.contacts);
        const savedContact = {
            id: contactId,
            name: draft.name.trim(),
            phone: draft.phone.trim(),
            email: draft.email.trim(),
        };
        // PRINSIPP: Nye objekter og arrays gir forutsigbare endringer.
        // Gamle referanser beholder innholdet sitt; mutasjon er ikke forbudt i JS.
        model.data.contacts = draft.contactId === null
            ? [...model.data.contacts, savedContact]
            : model.data.contacts.map(contact =>
                contact.id === contactId ? savedContact : contact);
        model.data.memberships = [
            ...model.data.memberships.filter(membership => membership.contactId !== contactId),
            ...draft.selectedGroupIds.map(groupId => ({ contactId, groupId })),
        ];
        model.viewState.editContactPage = emptyContactDraft();
        goToContactsPage();
    }

    function cancelEditContact() {
        // Forkast utkastet. Ingen domenedata har blitt endret.
        model.viewState.editContactPage = emptyContactDraft();
        goToContactsPage();
    }

    function deleteContact(contactId) {
        // PRINSIPP: ID identifiserer kontakten også etter søk eller sortering.
        // Array-indeksen er bare en plassering og kan endre seg.
        model.data.contacts = model.data.contacts.filter(contact => contact.id !== contactId);
        model.data.memberships = model.data.memberships
            .filter(membership => membership.contactId !== contactId);
        updateView();
    }

    function createGroup() {
        const name = model.viewState.groupsPage.newGroupName.trim();
        if (!name) return;
        model.data.groups = [...model.data.groups, { id: getNextId(model.data.groups), name }];
        model.viewState.groupsPage.newGroupName = '';
        updateView();
    }

    return {
        goToContactsPage, goToGroupsPage, startNewContact, startEditContact,
        saveContact, cancelEditContact, deleteContact,
        toggleGroupForEditedContact, createGroup,
    };
}
