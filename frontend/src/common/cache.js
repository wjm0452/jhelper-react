import httpClient from "./httpClient";

export default class Cache {
  constructor(options = {}) {
    this._url = options.url || "/api/cache";
  }

  set(key, value) {
    return httpClient
      .post(this._url, {
        key: key,
        value: value,
      })
      .then(function (data) {
        return data;
      });
  }

  get(key) {
    return httpClient.get(this._url + "/" + key).then(function (data) {
      return data && data.value != null ? data.value : null;
    });
  }
}
