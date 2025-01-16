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

  async get(url, config = {}) {
    return this.request({
      method: "get",
      url: url,
      ...config,
    });
  }

  async delete(url, config = {}) {
    return this.request({
      method: "delete",
      url: url,
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
