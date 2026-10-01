// BRUKERHANDLING → CONTROLLER → MODELLENDRING → updateView() → NY HTML
function updateView() {
    if (Model.app.currentPage === 'contactsPage') {
        updateViewContactsPage();
    }
    else if (Model.app.currentPage === 'editContactPage') {
        updateViewEditContactPage();
    }
    else if (Model.app.currentPage === 'groupsPage') {
        updateViewGroupsPage();
    }
}

updateView();
