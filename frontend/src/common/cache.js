import axios from "axios"

export default class Cache {

    constructor(options = {}) {
        this._url = options.url || '/api/cache';
    }

    set(key, value) {
        return axios.post(this._url, {
            key: key,
            value: value
        }).then(function (res) {
            return res.data;
        });
    }

    get(key) {
        return axios.get(this._url + '/' + key).then(function (res) {
            var data = res.data;
            return data && data.value != null ? res.data.value : null;
        });
    }
}