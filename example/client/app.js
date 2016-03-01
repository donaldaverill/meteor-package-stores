Template.app.events({
  'click [data-show-todos]'() {
    Actions.Todos.toggleTodos();
  },
  'click [data-reset-defaults]'() {
    Actions.Todos.resetToDefaults();
    Actions.Todos.clearSubs();
  },
});

Meteor.setInterval(() => Actions.Todos.updateClock(), 1000);
