function Store(options) {
  // Passing in a storeName will add that storeName to the ReactiveDict.
  // Doing so, you will retain state through hot code push. Otherwise, a random
  // id will be used as the name for the ReactiveDict.
  const storeName = options.storeName ? options.storeName : Random.id();
  ReactiveDict.call(this, storeName);

  this.defaults = {};
  if (options.defaults) {
    this.setDefaults(options.defaults);
  }

  this.methods = {};
  if (options.methods) {
    this.setMethods(options.methods);
  }

  let subOptions = {
    cacheLimit: 99,
    expireIn: 100,
  };

  if (options.subOptions) {
    subOptions = options.subOptions;
    delete options.subOptions;
  }
  this.subsCache = new SubsManager(subOptions);

  // delete storeName and defaults as they are not to be used for
  // Reflux store creation.
  delete options.storeName;
  delete options.defaults;

  // if fourquet:actions is present, add its functionality as well
  if (Package['fourquet:actions']) {
    _.extend(Package['fourquet:actions'].Actions.createStore(options), this);
  }
  return this;
}

Store.prototype = Object.create(ReactiveDict.prototype);

_.extend(Store.prototype, {
  setDefault(key, value) {
    if (_.isFunction(value)) {
      ReactiveDict.prototype.setDefault.call(this, key, value());
    } else {
      ReactiveDict.prototype.setDefault.call(this, key, value);
    }
    this.defaults[key] = value;
  },
  setDefaults(defaults) {
    for (const d in defaults) {
      if (defaults.hasOwnProperty(d)) {
        this.setDefault(d, defaults[d]);
      }
    }
  },
  setMethod(key, value) {
    this[key] = value;
  },
  setMethods(methods) {
    for (const m in methods) {
      if (methods.hasOwnProperty(m)) {
        this.setMethod(m, methods[m]);
      }
    }
  },
  resetToDefault(key) {
    let defaultValue = null;
    if (_.isFunction(this.defaults[key])) {
      defaultValue = this.defaults[key]();
    } else {
      defaultValue = this.defaults[key];
    }
    this.set(key, defaultValue);
  },
  resetToDefaults() {
    for (const key in this.keys) {
      if (this.keys.hasOwnProperty(key)) {
        this.resetToDefault(key);
      }
    }
  },
  subscribe() {
    return this.subsCache.subscribe.apply(this.subsCache, arguments);
  },
  clearSubs() {
    this.subsCache.clear();
  },
  subsReady() {
    return this.subsCache.ready();
  },
});

Stores = {};

Stores.create = function(options) {
  return new Store(options);
};
