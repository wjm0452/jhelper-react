import Cache from "./cache";

export default class CacheContext {
  _cache = new Cache();
  _name;
  _timer;
  _tmp;

  constructor(context) {
    this._context = context;
    this._name = this._context.constructor.name;
  }

  translateKey(key) {
    return this._name + "_" + key;
  }

  setCache(key, value) {
    if (!this._tmp) {
      this._tmp = {};
    }

    if (typeof value == "object") {
      value = JSON.stringify(value);
    }

    this._tmp[key] = value;

    if (this._timer) {
      window.clearTimeout(this._timer);
    }

    this._timer = window.setTimeout(() => {
      var object = this._tmp;
      for (var [key, value] of Object.entries(object)) {
        this._cache.set(this.translateKey(key), value);
      }
      this._timer = null;
      this._tmp = null;
    }, 500);
  }

  setCaches(object) {
    for (var [key, value] of Object.entries(object)) {
      this.setCache(key, value);
    }
  }

  getCache(key) {
    return this._cache.get(this.translateKey(key)).then((value) => {
      if (value && (value.startsWith("{") || value.startsWith("["))) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }

      return value;
    });
  }

  getCaches(keys) {
    var promises = keys.map((key) => this.getCache(key));

    return Promise.all(promises).then((cacheValues) => {
      return keys.reduce((result, key, i) => {
        result[key] = cacheValues[i] || "";
        return result;
      }, {});
    });
  }
}
