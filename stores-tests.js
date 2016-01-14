if (Meteor.isClient) {
  Tinytest.add('Stores - defined on client', (test) => {
    test.notEqual(Stores, undefined, 'Expected ' +
      'Stores to be defined on the client.');
  });
}
