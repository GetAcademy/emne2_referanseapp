function goToGroupsPage() {
    clearEditContactViewState();
    model.app.currentPage = 'groupsPage';
    updateView();
}

function createGroup() {
    const viewState = model.viewState.groupsPage;
    const name = viewState.newGroupName.trim();
    if (name === '') return;

    const newGroup = {
        id: getNextId(model.groups),
        name: name,
    };
    model.groups.push(newGroup);
    viewState.newGroupName = '';
    updateView();
}
