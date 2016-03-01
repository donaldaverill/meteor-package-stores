Meteor.publish('todos', () => {
  Meteor._sleepForMs(2000); // add a delay to mimic the network time
  return Todos.find();
});
