let store = (function() {

  let subscribers = [];
  let middlewares = [];

  let data = {};
  let proxy = new Proxy(data, {
    set: function (target, propertyKey, newVal)  {
      let { source, value, sourceOverride } = newVal;
      source.__id = generateIdentifier(source);
      // no source? setting data directly?
      if(source === undefined) return;

      // set value in history
      history.receive(value, propertyKey, source);

      // pre-process value from our middleware
      value = middlewares.reduce((val, middleware) => middleware.process && middleware.process(val, propertyKey) || val, value);

      // get existing value
      let { value: oldVal } = Reflect.get(data, propertyKey) || {};

      // set the value to data store
      Reflect.set(data, propertyKey, newVal)

      // set value to subscribers
      subscribers.forEach(o => o.receive(value, propertyKey, oldVal, sourceOverride || source))
    }
  });

  let generateIdentifier = function(source) {
    if(typeof source === 'function' && source.name) {
      return source.name;
    }
    else if (source.id) {
      return source.id
    }
    else if(source.tagName && source.className) {
      return `${source.tagName}.${source.className.split(' ').join('.')}`;
    }
    return "<no-id>";
  }

  let send = function(source, { key, value }) {
    proxy[key] = { source, value };
  }

  let history = (function() {
    let send = function (key, value) {
      proxy[key] = { source: this, value  }
    };

    return {
      current: {},
      history: [],
      receive(value, key, source) {
        if(source !== this) {
          let data = { key, source, value };

          if(this.current.index !== undefined && this.current.index !== this.history.length - 1) {
            this.history = this.history.slice(0, this.current.index + 1);
          }

          this.history.push(this.current.data = data)
          this.current.index = this.history.length - 1;
        }
      },
      first() {
        this.current.data = this.history[this.current.index = 0]
        send.call(this, this.current.data.key, this.current.data.value)
      },
      last() {
        this.current.data = this.history[this.current.index = this.history.length - 1]
        send.call(this, this.current.data.key, this.current.data.value)
      },
      back(step = 1) {
        if(this.current.index === undefined) {
          this.current.index = this.history.length - 1;
        }
        if(this.current.index > 0) {
          this.current.data = this.history[this.current.index = this.current.index - step]
          send.call(this, this.current.data.key, this.current.data.value)
        }
      },
      forward(step = 1) {
        if(this.current.index === undefined) {
          this.current.index = this.history.length - 1;
        }
        if(this.current.index < this.history.length - 1) {
          this.current.data = this.history[this.current.index = this.current.index + step]
          send.call(this, this.current.data.key, this.current.data.value)
        }
      },
      replay(ms = 200) {
        this.current.index = -1;
        for(let step = 0; step < this.history.length; step++) {
          window.setTimeout(this.forward.bind(this, 1), ms * step)
        }
      }
    }
  })();

  let store = {
    history,
    get data() {
      return { ...data };
    },
    subscribe(...objs) {
      objs.forEach(obj => {
        obj.send = send.bind(null, obj)
        subscribers.push(obj)
      });
    },
    unsubscribe(obj) {
      delete obj.send;
      subscribers = subscribers.filter(o => obj !== o)
    },
    dispatch(fn) {
      // let { value } = fn()
      send.call(null, fn, fn());
    },
    middleware(...objs) {
      middlewares = middlewares.concat(objs)
    }
  }

  return Object.freeze(store);
})();