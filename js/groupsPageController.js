function goToGroupsPage() {
    clearEditContactViewState();
    Model.app.currentPage = 'groupsPage';
    updateView();
}

function createGroup() {
    const name = Model.ViewState.groupsPage.newGroupName.trim();
    if (name === '') return;

    const newGroup = { id: getNextId(Model.groups), name: name };
    const newGroups = copyArray(Model.groups);
    newGroups.push(newGroup);
    Model.groups = newGroups;
    Model.ViewState.groupsPage.newGroupName = '';
    updateView();
}
