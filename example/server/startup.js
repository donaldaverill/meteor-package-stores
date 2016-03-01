Meteor.startup(() => {
  // Todos.remove({}); // uncomment to refresh data
  if (Todos.find().count() === 0) {
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
  }
});
