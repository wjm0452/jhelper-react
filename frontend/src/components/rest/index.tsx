import React, { RefObject } from "react";
import httpClient from "../../common/httpClient";
import RequestArea from "./requestArea";
import ResponseArea from "./responseArea";
import CacheContext from "../../common/cacheContext";

async function readRestProxy(requestData: any) {
  return await httpClient.post("/api/rest-proxy/", requestData);
}

export default class Rest extends React.Component<any, any> {
  private requestAreaRef: RefObject<RequestArea>;
  private responseAreaRef: RefObject<ResponseArea>;
  private cacheContext: CacheContext;

  constructor(props: any) {
    super(props);
    this.state = {
      url: "",
      method: "GET",
    };

    this.requestAreaRef = React.createRef<RequestArea>();
    this.responseAreaRef = React.createRef<ResponseArea>();

    this.cacheContext = new CacheContext(this);
  }

  componentDidMount() {
    this.cacheContext.getCaches(["url", "method"]).then((caches) => {
      this.setState({
        url: caches.url,
        method: caches.method,
      });
    });
  }

  send() {
    const requestData: any = this.requestAreaRef.current?.getData();
    requestData.url = this.state.url;
    requestData.method = this.state.method;

    readRestProxy(requestData).then((data: any) => {
      this.responseAreaRef.current?.setData(data);
    });
  }

  render() {
    return (
      <div className="d-flex flex-column h-100">
        <div className="input-group p-2">
          <div className="input-group-text">
            <select
              className="form-select"
              value={this.state.method || "GET"}
              onChange={(e) => {
                this.cacheContext.setCache("method", e.target.value);
                this.setState({ method: e.target.value });
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
              <option value="OPTIONS">OPTIONS</option>
              <option value="HEAD">HEAD</option>
            </select>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="url..."
            value={this.state.url}
            onChange={(e) => {
              this.cacheContext.setCache("url", e.target.value);
              this.setState({ url: e.target.value });
            }}
          />
          <button type="button" className="btn btn-primary" onClick={() => this.send()}>
            send
          </button>
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <div className="h-50 p-2">
            <RequestArea ref={this.requestAreaRef} />
          </div>
          <div className="h-50 p-2">
            <ResponseArea ref={this.responseAreaRef} />
          </div>
        </div>
      </div>
    );
  }
}
