function updateViewGroupsPage() {
    let html = /*HTML*/`
        <h1>Grupper</h1>
        <form class="new-group" onsubmit="createGroup(); return false;">
            <label for="new-group">Navn på ny gruppe</label>
            <div class="actions">
                <input id="new-group" required
                    value="${escapeHtml(Model.ViewState.groupsPage.newGroupName)}"
                    oninput="Model.ViewState.groupsPage.newGroupName = this.value">
                <button type="submit">Opprett gruppe</button>
            </div>
        </form>
        <div class="cards">`;

    for (let group of Model.groups) {
        html += createGroupHtml(group);
    }
    if (Model.groups.length === 0) html += '<p>Ingen grupper ennå.</p>';
    html += '</div>';
    document.getElementById('app').innerHTML = html;
}

function createGroupHtml(group) {
    // Medlemmene finnes via memberships; gruppen lagrer ingen egen kontaktliste.
    const contacts = getContactsForGroup(group.id);
    let html = /*HTML*/`<section class="card"><h2>${escapeHtml(group.name)}</h2>`;
    if (contacts.length === 0) {
        html += '<p class="muted">Ingen medlemmer</p>';
    } else {
        html += '<ul>';
        for (let contact of contacts) {
            html += /*HTML*/`<li>${escapeHtml(contact.name)}</li>`;
        }
        html += '</ul>';
    }
    html += '</section>';
    return html;
}
