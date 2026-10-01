import { createModel } from './model.js';
import { createController } from './controller.js';
import { contactsPageView, editContactPageView, groupsPageView } from './view.js';
import './style.css';

const model = createModel();
const actions = createController(model, updateView);

// ES modules er lokale. Disse tre navnene eksponeres for HTML-hendelsene,
// slik at koblingen fra knapp til controller er synlig i view-koden.
Object.assign(window, { model, actions, updateView });

// BRUKERHANDLING → CONTROLLER → MODELLENDRING → updateView() → NY HTML
// Én sentral funksjon velger side ut fra app-state. Viewene leser modellen.
function updateView() {
    // Ny innerHTML erstatter inputfeltet ved søk. Bevar fokus og markør
    // i view-laget, slik at brukeren kan fortsette å skrive etter tegning.
    const active = document.activeElement;
    const focusId = active?.id;
    const selectionStart = active?.selectionStart;
    const selectionEnd = active?.selectionEnd;
    const page = model.app.currentPage;
    let content;
    if (page === 'contactsPage') content = contactsPageView(model);
    else if (page === 'editContactPage') content = editContactPageView(model);
    else if (page === 'groupsPage') content = groupsPageView(model);

    document.getElementById('app').innerHTML = `
        <header><div class="header-inner"><span class="brand">Kontaktboka <small>Emne 2</small></span>
            <nav aria-label="Hovedmeny">
                <button class="nav-button" ${page === 'contactsPage' ? 'aria-current="page"' : ''}
                    onclick="actions.${page === 'editContactPage' ? 'cancelEditContact' : 'goToContactsPage'}()">Kontakter</button>
                <button class="nav-button" ${page === 'groupsPage' ? 'aria-current="page"' : ''}
                    ${page === 'editContactPage' ? 'disabled' : ''}
                    onclick="actions.goToGroupsPage()">Grupper</button>
            </nav></div></header>
        <main>${content}</main>
        <footer>Referanseapp for Emne 2 · Data lagres kun i minnet og nullstilles ved omlasting.</footer>`;

    const replacement = focusId && document.getElementById(focusId);
    if (replacement) {
        replacement.focus();
        if (selectionStart != null && typeof replacement.setSelectionRange === 'function') {
            replacement.setSelectionRange(selectionStart, selectionEnd);
        }
    }
}

updateView();
