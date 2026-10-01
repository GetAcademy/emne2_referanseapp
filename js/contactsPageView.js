function updateViewContactsPage() {
    const contacts = getFilteredContacts();
    document.getElementById('app').innerHTML = /*HTML*/`
        <div class="page-heading">
            <h1>Kontakter</h1>
            <button onclick="startNewContact()">Ny kontakt</button>
        </div>
        <label for="search">Søk etter navn, telefon eller e-post</label>
        <input id="search" type="search"
            value="${escapeHtml(model.viewState.contactsPage.searchText)}"
            oninput="model.viewState.contactsPage.searchText = this.value; updateView()">
        <p class="muted">${contacts.length} av ${model.contacts.length} kontakter</p>
        <div class="cards">
          ${createContactsHtml()}
        </div>`;
}

function createContactsHtml() {
    if (contacts.length === 0) {
        return '<p>Ingen kontakter å vise. Prøv et annet søk eller opprett en kontakt.</p>';
    }
    let html = '';
    for (let contact of contacts) {
        html += createContactHtml(contact);
    }
    return html;
}

function createContactHtml(contact) {
    let groupNames = '';
    for (let group of getGroupsForContact(contact.id)) {
        if (groupNames !== '') groupNames += ', ';
        groupNames += escapeHtml(group.name);
    }
    if (groupNames === '') groupNames = 'Ingen';

    return /*HTML*/`
        <article class="card">
            <h2>${escapeHtml(contact.name)}</h2>
            <p>${escapeHtml(contact.phone)}</p>
            <p>${escapeHtml(contact.email)}</p>
            <p class="groups">Grupper: ${groupNames}</p>
            <div class="actions">
                <button class="secondary" onclick="startEditContact(${contact.id})">Rediger</button>
                <button class="danger" onclick="deleteContact(${contact.id})">Slett</button>
            </div>
        </article>`;
}
