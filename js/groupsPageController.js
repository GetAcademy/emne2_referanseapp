function goToGroupsPage() {
    clearEditContactViewState();
    model.app.currentPage = 'groupsPage';
    updateView();
}

function createGroup() {
    const ViewState = model.viewState.groupsPage;
    const name = ViewState.newGroupName.trim();
    if (name === '') return;

    const newGroup = { id: getNextId(model.groups), name: name };
    const newGroups = copyArray(model.groups);
    newGroups.push(newGroup);
    model.groups = newGroups;
    ViewState.newGroupName = '';
    updateView();
}
