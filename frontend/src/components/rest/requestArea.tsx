import React, { RefObject } from "react";
import Headers from "./headers";
import Params from "./params";
import BodyValue from "./bodyValue";
import CacheContext from "../../common/cacheContext";

export default class RequestArea extends React.Component<any, any> {
  private headersRef: RefObject<Headers>;
  private paramsRef: RefObject<Params>;
  private bodyValueRef: RefObject<BodyValue>;
  private cacheContext: CacheContext;

  constructor(props: any) {
    super(props);

    this.headersRef = React.createRef<Headers>();
    this.paramsRef = React.createRef<Params>();
    this.bodyValueRef = React.createRef<BodyValue>();

    this.state = {
      tabIndex: 0,
      headers: [{ key: "", value: "" }],
      params: [{ key: "", value: "" }],
      bodyValue: "",
    };
  }

  setData(data: any) {
    if (data.headers) {
      this.headersRef.current?.setData(data.headers);
    }
    if (data.params) {
      this.paramsRef.current?.setData(data.params);
    }
    if (data.bodyValue) {
      this.bodyValueRef.current?.setValue(data.bodyValue);
    }
  }

  getData() {
    var headers = this.headersRef.current?.getData();
    var params = this.paramsRef.current?.getData();
    var bodyValue = this.bodyValueRef.current?.getValue();

    headers = headers.reduce((p: any, item: any) => {
      if (item.key && item.value) {
        p[item.key] = item.value;
      }
      return p;
    }, {});

    params = params.reduce((p: any, item: any) => {
      if (item.key && item.value) {
        p[item.key] = item.value;
      }
      return p;
    }, {});

    return {
      headers,
      params,
      bodyValue,
    };
  }

  tabIndex(index: number) {
    this.setState({ tabIndex: index });
  }

  render() {
    const tabIndex = this.state.tabIndex;
    return (
      <div className="d-flex flex-column h-100">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={"nav-link " + (tabIndex == 0 ? "active" : "")}
              type="button"
              role="tab"
              onClick={() => this.tabIndex(0)}
            >
              Headers
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={"nav-link " + (tabIndex == 1 ? "active" : "")}
              type="button"
              role="tab"
              onClick={() => this.tabIndex(1)}
            >
              Params
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={"nav-link " + (tabIndex == 2 ? "active" : "")}
              type="button"
              role="tab"
              onClick={() => this.tabIndex(2)}
            >
              Body
            </button>
          </li>
        </ul>
        <div className="flex-grow-1 tab-content overflow-hidden">
          <div
            className={"h-100 tab-pane " + (tabIndex == 0 ? "active" : "")}
            role="tabpanel"
          >
            <Headers ref={this.headersRef} data={this.state.headers} />
          </div>
          <div
            className={"h-100 tab-pane " + (tabIndex == 1 ? "active" : "")}
            role="tabpanel"
          >
            <Params ref={this.paramsRef} data={this.state.params} />
          </div>
          <div
            className={"h-100 tab-pane " + (tabIndex == 2 ? "active" : "")}
            role="tabpanel"
          >
            <BodyValue ref={this.bodyValueRef} value={this.state.bodyValue} />
          </div>
        </div>
      </div>
    );
  }
}
