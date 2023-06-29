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
    }).catch((e) => {
      if (e.response.status == 403) {
        const data = e.response.data;
        alert(data.message);
      }

      throw e;
    });
  }

  get(url, config = {}) {
    return axios
      .get(this.getApiUrl(url), {
        ...config,
      })
      .catch((e) => {
        if (e.response.status == 403) {
          const data = e.response.data;
          alert(data.message);
        }

        throw e;
      });
  }

  delete(url, config = {}) {
    return axios
      .get(this.getApiUrl(url), {
        ...config,
      })
      .catch((e) => {
        if (e.response.status == 403) {
          const data = e.response.data;
          alert(data.message);
        }

        throw e;
      });
  }

  post(url, data, config = {}) {
    return axios
      .post(this.getApiUrl(url), data, {
        ...config,
      })
      .catch((e) => {
        if (e.response.status == 403) {
          const data = e.response.data;
          alert(data.message);
        }

        throw e;
      });
  }

  put(url, data, config = {}) {
    return axios
      .put(this.getApiUrl(url), data, {
        ...config,
      })
      .catch((e) => {
        if (e.response.status == 403) {
          const data = e.response.data;
          alert(data.message);
        }

        throw e;
      });
  }

  getApiUrl(url) {
    return this._url + url;
  }
}

const httpClient = new HttpClient("");
export default httpClient;
