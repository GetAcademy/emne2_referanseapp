// Input vises som tekst, aldri som brukerdefinert HTML (også i value-attributter).
export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
}

// PRINSIPP: Avledede verdier. Begge relasjonsoppslag beregnes ved visning.
// Modellen husker bare entitetene og ID-koblingene, ikke resultatlistene.
export function getGroupsForContact(model, contactId) {
    return model.data.groups.filter(group => model.data.memberships.some(
        membership => membership.contactId === contactId && membership.groupId === group.id));
}

export function getContactsForGroup(model, groupId) {
    return model.data.contacts.filter(contact => model.data.memberships.some(
        membership => membership.groupId === groupId && membership.contactId === contact.id));
}

export function contactsPageView(model) {
    const searchText = model.viewState.contactsPage.searchText;
    // PRINSIPP: Filtrerte kontakter lagres ikke. contacts + searchText er nok;
    // en ekstra liste i modellen kunne kommet ut av synk med originalen.
    const filteredContacts = model.data.contacts.filter(contact =>
        `${contact.name} ${contact.phone} ${contact.email}`.toLocaleLowerCase('nb')
            .includes(searchText.trim().toLocaleLowerCase('nb')));
    return `
        <div class="page-heading"><h1>Kontakter</h1>
            <button onclick="actions.startNewContact()">Ny kontakt</button></div>
        <label for="search">Søk etter navn, telefon eller e-post</label>
        <input id="search" type="search" value="${escapeHtml(searchText)}"
            oninput="model.viewState.contactsPage.searchText = this.value; updateView()">
        <p class="muted" role="status">${filteredContacts.length} av ${model.data.contacts.length} kontakter</p>
        <div class="cards">${filteredContacts.map(contact => contactCard(model, contact)).join('') ||
            '<p>Ingen kontakter å vise. Prøv et annet søk eller opprett en kontakt.</p>'}</div>`;
}

function contactCard(model, contact) {
    const groups = getGroupsForContact(model, contact.id);
    return `<article class="card">
        <h2>${escapeHtml(contact.name)}</h2>
        <p>${escapeHtml(contact.phone) || 'Ingen telefon'}</p>
        <p>${escapeHtml(contact.email) || 'Ingen e-post'}</p>
        <p class="groups">Grupper: ${groups.map(group => escapeHtml(group.name)).join(', ') || 'Ingen'}</p>
        <div class="actions">
            <button class="secondary" onclick="actions.startEditContact(${contact.id})"
                aria-label="Rediger ${escapeHtml(contact.name)}">Rediger</button>
            <button class="danger" onclick="actions.deleteContact(${contact.id})"
                aria-label="Slett ${escapeHtml(contact.name)}">Slett</button>
        </div></article>`;
}

export function editContactPageView(model) {
    const draft = model.viewState.editContactPage;
    // Enkle input-events skriver kun til viewState, aldri til data.
    return `<h1>${draft.contactId === null ? 'Ny kontakt' : 'Rediger kontakt'}</h1>
        <p class="muted">Endringene lagres når du trykker Lagre. Avbryt forkaster utkastet.</p>
        <form onsubmit="event.preventDefault(); actions.saveContact()">
            <label for="name">Navn (obligatorisk)</label>
            <input id="name" autocomplete="name" required pattern=".*\\S.*" value="${escapeHtml(draft.name)}"
                oninput="model.viewState.editContactPage.name = this.value">
            <label for="phone">Telefon</label>
            <input id="phone" type="tel" autocomplete="tel" value="${escapeHtml(draft.phone)}"
                oninput="model.viewState.editContactPage.phone = this.value">
            <label for="email">E-post</label>
            <input id="email" type="email" autocomplete="email" value="${escapeHtml(draft.email)}"
                oninput="model.viewState.editContactPage.email = this.value">
            <fieldset><legend>Grupper</legend>
                ${model.data.groups.map(group => groupCheckbox(group, draft.selectedGroupIds)).join('') ||
                    '<p>Ingen grupper er opprettet ennå.</p>'}
            </fieldset>
            <div class="actions"><button type="submit">Lagre</button>
                <button type="button" class="secondary" onclick="actions.cancelEditContact()">Avbryt</button>
            </div>
        </form>`;
}

function groupCheckbox(group, selectedGroupIds) {
    return `<label class="checkbox" for="group-${group.id}">
        <input id="group-${group.id}" type="checkbox" ${selectedGroupIds.includes(group.id) ? 'checked' : ''}
            onchange="actions.toggleGroupForEditedContact(${group.id})">${escapeHtml(group.name)}</label>`;
}

export function groupsPageView(model) {
    return `<h1>Grupper</h1>
        <form class="new-group" onsubmit="event.preventDefault(); actions.createGroup()">
            <label for="new-group">Navn på ny gruppe</label>
            <div class="actions"><input id="new-group" required pattern=".*\\S.*"
                value="${escapeHtml(model.viewState.groupsPage.newGroupName)}"
                oninput="model.viewState.groupsPage.newGroupName = this.value">
                <button type="submit">Opprett gruppe</button></div>
        </form>
        <div class="cards">${model.data.groups.map(group => groupSection(model, group)).join('') ||
            '<p>Ingen grupper ennå.</p>'}</div>`;
}

function groupSection(model, group) {
    const contacts = getContactsForGroup(model, group.id);
    return `<section class="card"><h2>${escapeHtml(group.name)}</h2>
        ${contacts.length ? `<ul>${contacts.map(contact => `<li>${escapeHtml(contact.name)}</li>`).join('')}</ul>`
            : '<p class="muted">Ingen medlemmer</p>'}</section>`;
}
