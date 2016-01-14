Package.describe({
  name: 'fourquet:stores',
  version: '0.0.1',
  summary: 'Client-side domain management for Meteor.',
  git: 'https://github.com/fourquet/meteor-package-stores',
  documentation: 'README.md',
  license: 'LICENSE',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('reactive-dict');
  api.use([
    'underscore',
    'random',
  ]);
  api.imply('random');
  api.use('templating', ['client'], {
    weak: true,
  });
  api.use('fourquet:actions@0.0.1', ['client'], {
    weak: true,
  });
  api.use('meteorhacks:subs-manager@1.6.3');
  api.addFiles('helpers.js', ['client']);
  api.addFiles('stores.js');
  api.export('Stores');
});

Package.onTest(function(api) {
  api.use('ecmascript@0.1.6', ['client', 'server']);
  api.use('tinytest', ['client', 'server']);
  api.use(['fourquet:stores'], ['client', 'server']);
  api.addFiles('stores-tests.js', ['client', 'server']);
});
