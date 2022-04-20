import React, { RefObject } from "react";
import Headers from "./headers";
import BodyValue from "./bodyValue";

export default class RequestArea extends React.Component<any, any> {
  private headersRef: RefObject<Headers>;
  private bodyValueRef: RefObject<BodyValue>;

  constructor(props: any) {
    super(props);

    this.headersRef = React.createRef<Headers>();
    this.bodyValueRef = React.createRef<BodyValue>();

    this.state = {
      tabIndex: 0,
      headers: []
    };
  }

  setData(data: any) {
    if (data.headers) {
      this.headersRef.current?.setData(data.headers);
    }
    if (data.bodyValue) {
      this.bodyValueRef.current?.setValue(data.bodyValue);
    }
  }

  getData() {
    const headers = this.headersRef.current
      ?.getData()
      .reduce((p: any, item: any) => {
        if (item.key && item.value) {
          p[item.key] = item.value;
        }
        return p;
      }, {});

    const bodyValue = this.bodyValueRef.current?.getValue();

    return {
      headers,
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
        <div className="">
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
                className={"nav-link " + (tabIndex == 2 ? "active" : "")}
                type="button"
                role="tab"
                onClick={() => this.tabIndex(2)}
              >
                Body
              </button>
            </li>
          </ul>
        </div>
        <div className="flex-grow-1 tab-content overflow-hidden">
          <div
            className={"h-100 tab-pane " + (tabIndex == 0 ? "active" : "")}
            role="tabpanel"
          >
            <Headers ref={this.headersRef} data={this.state.headers} />
          </div>
          <div
            className={"h-100 tab-pane " + (tabIndex == 2 ? "active" : "")}
            role="tabpanel"
          >
            <BodyValue ref={this.bodyValueRef} />
          </div>
        </div>
      </div>
    );
  }
}
