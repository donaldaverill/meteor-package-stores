Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Actions.Todos = Actions.createActions([
    'addTodo',
    'removeTodo',
    'changeNewTodoPlaceholder',
    'resetNewTodoPlaceholder',
    // The below actions can be called directly on the Todos Store.
    'resetToDefaults',
    'subscribe',
    'clearSubs',
  ]);

  Stores.Todos = Stores.create({
    storeName: 'Todos',
    listenables: Actions.Todos,
    defaults: {
      currentDate() {
        return new Date().toString();
      },
      newTodoPlaceholder: 'New Todo', // Manage some UI for fun.
    },
    methods: {
      numTodos() {
          return this.todos().count();
      },
      todos() {
        return Todos.find({}, {sort: {created: -1}});
      },
    },
    onAddTodo(name) {
      return name ? Todos.insert({name: name, created: new Date()}) : null;
    },
    onRemoveTodo(id) {
      return id ? Todos.remove({_id: id}) : null;
    },
    onChangeNewTodoPlaceholder(placeholder) {
      return placeholder ? this.set('newTodoPlaceholder', placeholder) : null;
    },
    onResetNewTodoPlaceholder() {
      return this.resetToDefault('newTodoPlaceholder');
    },
    onResetToDefaults() {
      return this.resetToDefaults();
    },
    onSubscribe(subscription) {
      return this.subscribe(subscription);
    },
    onClearSubs() {
      return this.clearSubs();
    }
  });

  Template.todos.events({
    'click [data-add-todo]'(e, t) {
      e.preventDefault();
      const newTodo = t.$('#newTodo').val();
      Actions.Todos.addTodo(newTodo);
      t.$('#newTodo').val(null);
    },
    'click [data-remove-todo]'(e, t) {
      e.preventDefault();
      const id = e.currentTarget.dataset.removeTodo;
      Actions.Todos.removeTodo(id);
    },
    'click [data-change-new-todo-placeholder]'(e, t) {
      e.preventDefault();
      const newPlaceholder = t.$('#newPlaceholder').val();
      Actions.Todos.changeNewTodoPlaceholder(newPlaceholder);
    },
    'click [data-reset-new-todo-placeholder]'(e, t) {
      e.preventDefault();
      Actions.Todos.resetNewTodoPlaceholder();
      t.$('#newPlaceholder').val(null);
    },
  });

  Template.todos.onCreated(() => {
    Actions.Todos.resetToDefaults(); // or Stores.Todos.resetToDefaults();
    Actions.Todos.subscribe('todos'); // or Stores.Todos.subscribe('todos');
  });

  Template.todos.onDestroyed(() => {
    Actions.Todos.clearSubs(); // or Stores.Todos.clearSubs();
  });

  Template.wrapper.onCreated(function() { // don't us arrow, otherwise *this* won't work
    this.showTodos = new ReactiveVar(false);
  });
  Template.wrapper.helpers({
    showTodos() {
      return Template.instance().showTodos.get();
    },
  });
  Template.wrapper.events({
    'click [data-show-todos]' () {
      const showTodos = Template.instance().showTodos;
      return showTodos.get() ? showTodos.set(false) : showTodos.set(true);
    },
  });
}

if (Meteor.isServer) {
  Meteor.publish('todos', () => {
    return Todos.find();
  });

  Meteor.startup(() => {
    Todos.remove({});
    Todos.insert({
      name: 'Make sandwich',
      created: new Date(),
    });
    Todos.insert({
      name: 'Chop wood',
      created: new Date(),
    });
    Todos.insert({
      name: 'Weed the garden',
      created: new Date(),
    });
    Todos.insert({
      name: 'Walk dog',
      created: new Date(),
    });
    Todos.insert({
      name: 'Take nap',
      created: new Date(),
    });
  });
}
