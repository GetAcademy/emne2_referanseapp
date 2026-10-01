function goToGroupsPage() {
    clearEditContactViewState();
    model.app.currentPage = 'groupsPage';
    updateView();
}

function createGroup() {
    const name = model.viewState.groupsPage.newGroupName.trim();
    if (name === '') return;

    const newGroup = { id: getNextId(model.groups), name: name };
    const newGroups = copyArray(model.groups);
    newGroups.push(newGroup);
    model.groups = newGroups;
    model.viewState.groupsPage.newGroupName = '';
    updateView();
}
