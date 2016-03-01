Stores.Todos = Stores.create({
  storeName: 'Todos',
  listenables: Actions.Todos,
  defaults: {
    currentDate: () => new Date().toString(),
    newTodoPlaceholder: 'New Todo', // Manage some UI for fun.
    showTodos: false,
  },
  methods: {
    numberTodos() {
      return this.todos().count();
    },
    todos: () => Todos.find({}, { sort: { created: -1 } }),
    showTodos() {
      return this.get('showTodos');
    }
  },
  onAddTodo: name => name ? Todos.insert({ name: name, created: new Date() }) : null,
  onChangeNewTodoPlaceholder(placeholder) {
    return placeholder ? this.set('newTodoPlaceholder', placeholder) : null;
  },
  onClearSubs() {
    return this.clearSubs();
  },
  onRemoveTodo: _id => _id ? Todos.remove({ _id }) : null,
  onResetNewTodoPlaceholder() {
    return this.resetToDefault('newTodoPlaceholder');
  },
  onResetToDefaults() {
    return this.resetToDefaults();
  },
  onSubscribe(subscription) {
    return this.subscribe(subscription);
  },
  onToggleTodos() {
    this.set('showTodos', !this.get('showTodos'));
  },
  onUpdateClock() {
    this.set('currentDate', new Date());
  },
});
