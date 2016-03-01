Template.todos.onCreated(() => {
  Actions.Todos.subscribe('todos'); // or Stores.Todos.subscribe('todos');
});

Template.todos.onDestroyed(() => {
  // Actions.Todos.clearSubs(); // or Stores.Todos.clearSubs();
});

Template.todos.events({
  'click [data-add-todo]' (e, t) {
    const newTodo = t.$('#newTodo').val();
    Actions.Todos.addTodo(newTodo);
    t.$('#newTodo').val(null);
  },
  'click [data-remove-todo]' (e, t) {
    const id = e.currentTarget.dataset.removeTodo;
    Actions.Todos.removeTodo(id);
  },
  'click [data-change-new-todo-placeholder]' (e, t) {
    const newPlaceholder = t.$('#newPlaceholder').val();
    Actions.Todos.changeNewTodoPlaceholder(newPlaceholder);
  },
  'click [data-reset-new-todo-placeholder]' (e, t) {
    Actions.Todos.resetNewTodoPlaceholder();
    t.$('#newPlaceholder').val(null);
  },
});
