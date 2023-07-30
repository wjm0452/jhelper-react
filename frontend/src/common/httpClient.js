import axios from "axios";

class HttpClient {
  _url = "";
  _token = "";
  constructor(url) {
    this._url = url;
  }

  async request(config) {
    config.url = this.getApiUrl(config.url);

    const headers = {};
    if (this._token) {
      headers["Authorization"] = this._token;
    }

    config = {
      ...config,
      headers,
    };

    return axios
      .request({
        ...config,
        headers,
      })
      .then((res) => {
        const resHeaders = res.headers;
        const token = resHeaders["authorization"];

        if (token) {
          this._token = token;
        }

        return res;
      })
      .catch((e) => {
        if (e.response.status == 403) {
          const data = e.response.data;
          alert(data.message);
        }

        throw e;
      });
  }

  get(url, config = {}) {
    return this.request({
      method: "get",
      url: url,
      ...config,
    });
  }

  delete(url, config = {}) {
    return this.request({
      method: "get",
      url: url,
      ...config,
    });
  }

  post(url, data, config = {}) {
    return this.request({
      method: "post",
      url: url,
      data: data,
      ...config,
    });
  }

  put(url, data, config = {}) {
    return this.request({
      method: "put",
      url: url,
      data: data,
      ...config,
    });
  }

  getApiUrl(url) {
    return this._url + url;
  }
}

const httpClient = new HttpClient("");
export default httpClient;
