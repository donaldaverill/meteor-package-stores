# Stores for Meteor [![Build Status](https://travis-ci.org/fourquet/meteor-package-stores.svg?branch=master)](https://travis-ci.org/fourquet/meteor-package-stores)

Client-side domain and UI management for [Meteor](https://www.meteor.com/). See the [About](#about) section for more details.

### Install

`meteor add fourquet:stores`

Although not required, *Stores* compliments [`fourquet:actions`](https://atmospherejs.com/fourquet/actions)(*Actions*). In order to use *Actions*, [*Reflux*](https://www.npmjs.com/package/reflux-core) needs to be included in the app with a package such as [`fourquet:reflux-core`](https://github.com/fourquet/meteor-package-reflux-core),  [`fourquet:reflux`](https://github.com/fourquet/meteor-package-reflux) or from [NPM](https://www.npmjs.com/package/reflux-core).

#### About
*Stores* helps with client-side domain and UI management by combining [`reactive-dict`](https://atmospherejs.com/meteor/reactive-dict), [`meteorhacks:subs-manager`](https://atmospherejs.com/meteorhacks/subs-manager) and if included in the app, [`fourquet:actions`](https://atmospherejs.com/fourquet/actions). *Stores* works with [Blaze](https://www.meteor.com/blaze) or any other front end UI library, such as React or Angular. If [`templating`](https://atmospherejs.com/meteor/templating)(*Blaze*) is installed in the app, *Stores* provides a template helper (`Stores`) as well (see below).

#### Documentation

##### Stores.create(definition)
Create a new store and define its properties and behaviors.
```js
Stores.SomeDomain = Stores.create({
  // Definition (Object)
});
```
##### Definition, *Object*
properties:
- *storeName*, String, Optional.  - A name for the store for keeping store values during [hot code push](http://info.meteor.com/blog/meteor-hot-code-push).
- *listenables*, Object, Optional.
  - Defined when [Actions](https://atmospherejs.com/fourquet/actions) are created. Set this to the Actions object. See example below.
- *subOptions*, Object, Optional.
  - Options for the subscription manager. See the [`meteorhacks:subs-manager`](https://atmospherejs.com/meteorhacks/subs-manager) docs for more details. Default options: *{cacheLimit: 99, expireIn: 100}*.
- *defaults*, String, Number, Object, Array or Function, Optional.
  - Default values for the store. If a *function* is passed, the value of the *function* is set to its return value when the store is created or when either *resetToDefault(key)* or *resetToDefaults()* are called. `this` is available to get *ReactiveDict* values, store method results, or default values.
- *methods*, Function, Optional.
  - Store methods. `this` is available to get *ReactiveDict* values, store method results, or default values.  
- *on[ActionName]*, Function, Optional.
  - These methods should be defined if listenables are defined. Actions (without []) map to the action name with 'on' plus action name with the first character of the action name capitalized. `this` is available to get *ReactiveDict* values, store method results, or default values.  

```js
{
  storeName: 'StoreName', // optional
  listenables: someListenables, // optional
  subOptions: { // optional, defaults to cacheLimit: 99 and expireIn: 100
    cacheLimit: 10,
    expireIn: 5,
  },
  defaults: { // optional
    aDefault: 'Default',
    anotherDefault() {
      return 'Another Default';
    },
  },
  // methods are optional
  methods: {
    aMethod() {
      // whatever you want
      return 'something';
    },
    anotherMethod() {
      const something = this.aMethod();
      return something.length; // 9
    },
  }
  // on[Action]'s are optional but should be defined if listenables are defined.
  // Actions (without []) map to the action name with 'on' plus action name
  // with the first character of the action name capitalized.
  on[Action]() {
    // maybe do something.
    return 'something';
  },
  on[AnotherAction]() {
    // maybe do something else.
    return 'somethingElse';
  },
}
```
##### Default methods
- resetToDefault(key)
  - Resets a default value with *key* to its default state.
- resetToDefauts
  - Resets all defaults to their default state.

##### Subscriptions
See [`meteorhacks:subs-manager`](https://atmospherejs.com/meteorhacks/subs-manager) for more.
- *subscribe*
  - Subscribe to a publication and stay subscribed based on *subOptions*.
- *clearSubs*
  - Unsubscribe from all subscriptions.
- *subsReady*
  - Returs `true` if all store subscriptions are ready. Otherwise returns `false`.

```js
Stores.SomeDomain.subscribe('somePublication');
Stores.SomeDomain.subsready();
Stores.SomeDomain.clearSubs();
```

##### Methods
Call any method defined in the `methods` section.
```js
Stores.SomeDomain.aMethod();
```
`ReactiveDict` values can be set/get like:
```js
Stores.SomeDomain.set('someValue', 'Some Value');
Stores.SomeDomain.get('someValue'); // Some Value
```

##### Helpers
If the app is using *Blaze*, *Stores* offers a template helper `Stores`. Note that the `Stores` helper
is only useful if the store is defined so that it is in the `Stores` namespace. For example, do
`Stores.SomeDomain = Stores.create({ /* Definition */ });` instead of
`SomeDomain = Stores.create({ /* Definition */ });`
```html
<div>{{Stores.SomeDomain.get 'aDefault'}}</div>
<div>{{Stores.SomeDomain.aMethod}}</div>
<!-- etc. -->
```

#### Example
See the [repository](https://github.com/fourquet/meteor-package-stores/tree/master/example) for full working example. The below example uses [`fourquet:actions`](https://atmospherejs.com/fourquet/actions). Alternatively, *methods* can
be defined during store creation and then called on the store where `Actions` are used in the example below.
```html
<template name="todos">
  <p>Current Date {{Stores.Todos.get 'currentDate'}}</p>
  {{#if Stores.Todos.subsReady}}
    <p>There are {{Stores.Todos.numTodos}} todos.</p>
    <p>
      <input type="text" id="newTodo" placeholder={{Stores.Todos.get 'newTodoPlaceholder'}}>
      <button data-add-todo>Add Todo</button>
    </p>
    <p>
      <input type="text" id="newPlaceholder">
      <button data-change-new-todo-placeholder>Change Placeholder</button>
      <button data-reset-new-todo-placeholder>Reset Placeholder</button>
    </p>
    {{#each Stores.Todos.todos}}
      <p>{{name}}<button data-remove-todo={{_id}}>remove</button></p>
    {{/each}}
  {{else}}
    <p>Loading...</p>
  {{/if}}
</template>
```

```js
Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Actions.Todos = Actions.createActions([
    'addTodo',
    'removeTodo',
    'changeNewTodoPlaceholder',
    'resetNewTodoPlaceholder',
    // The below actions can be called directly on the Todos store.
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
      newTodoPlaceholder: 'New Todo', // Manage some UI, for fun.
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
    }
  })

  Template.todos.onCreated(function() {
    // If a subscription handle is needed subscribe directly with Stores
    // ex: const subHandle = Stores.Todos.subscribe('todos');
    Actions.Todos.subscribe('todos');
    Actions.Todos.resetToDefaults(); // or Stores.Todos.resetToDefaults();
  });

  Template.todos.onDestroyed(function() {
    Actions.Todos.clearSubs(); // or Stores.Todos.clearSubs();
  });
}
```

#### Todo
More tests

#### Version
0.0.1

#### License
MIT
