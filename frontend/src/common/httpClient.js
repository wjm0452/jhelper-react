import axios from "axios";

class HttpClient {
  _url = "";
  constructor(url) {
    this._url = url;
  }

  request(config) {
    config.url = this.getApiUrl(config.url);
    return axios({
      ...config,
    });
  }

  get(url, config = {}) {
    return axios.get(this.getApiUrl(url), {
      ...config,
    });
  }

  delete(url, config = {}) {
    return axios.get(this.getApiUrl(url), {
      ...config,
    });
  }

  post(url, data, config = {}) {
    return axios.post(this.getApiUrl(url), data, {
      ...config,
    });
  }

  put(url, data, config = {}) {
    return axios.put(this.getApiUrl(url), data, {
      ...config,
    });
  }

  getApiUrl(url) {
    return this._url + url;
  }
}

const httpClient = new HttpClient("");
export default httpClient;
