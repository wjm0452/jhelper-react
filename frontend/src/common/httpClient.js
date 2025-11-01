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

        return res.data;
      })
      .catch((e) => {
        let state = "";
        let detail = "";

        const response = e.response;

        if (response.status == 403) {
          const data = response.data;
          alert(data.detail);
        }

        if (response) {
          const data = response.data;

          if (data && data.state) {
            state = data.state;
            detail = data.detail;
          } else {
            state = "-1";
            detail = e.toString();
          }
        } else {
          state = "-1";
          detail = e.toString();
        }

        throw {
          state,
          detail,
        };
      });
  }

  async get(url, data, config = {}) {
    return this.request({
      method: "get",
      url: url,
      data: data,
      ...config,
    });
  }

  async delete(url, data, config = {}) {
    return this.request({
      method: "delete",
      url: url,
      data: data,
      ...config,
    });
  }

  async post(url, data, config = {}) {
    return this.request({
      method: "post",
      url: url,
      data: data,
      ...config,
    });
  }

  async put(url, data, config = {}) {
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

  async downloadFile(config, options) {
    const res = await this.request(config);
    this._downloadFile(res, options?.fileName);
  }

  _downloadFile(res, downloadName) {
    const blob = new Blob([res.data]);
    const fileObjectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileObjectUrl;
    link.style.display = "none";

    link.download = ((res) => {
      const disposition = res.headers["content-disposition"] || "";

      if (disposition.indexOf("filename") > -1) {
        let fileNameAttr = disposition.substring(disposition.indexOf("filename"));
        let fileName = fileNameAttr.split("=")[1].replace(/\"/g, "");
        fileName = decodeURIComponent(fileName);

        return fileName;
      }

      return downloadName;
    })(res);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(fileObjectUrl);
  }
}

const httpClient = new HttpClient("");
export default httpClient;
