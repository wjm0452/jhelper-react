import React, { ChangeEvent, RefObject } from "react";
import prettyJson from "../../../common/prettyJson";
import prettyXml from "../../../common/prettyXml";

export default class BodyValue extends React.Component<any, any> {
  private valueRef: RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      textType: "json",
      value: this.props.value || "",
    };

    this.valueRef = React.createRef<HTMLDivElement>();
  }

  setValue(value: string) {
    this.setState({ value });
  }

  getValue(): string {
    return this.valueRef.current?.innerText || "";
  }

  pretty() {
    let value: string = this.getValue();

    try {
      if (this.state.textType == "json") {
        value = prettyJson(value);
      } else if (this.state.textType == "xml") {
        value = prettyXml(value);
      }

      this.setValue(value);
    } catch (e) {
      console.log("error");
    }
  }

  onChangeTextType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      textType: e.target.value,
    });
  };

  renderValue() {
    const value = this.state.value;
    let lines: string[] = value.split(/\r\n|\n/g);

    return lines.map((line, i) => `<div>${line}</div>`).join("");
  }

  renderBody() {
    return (
      <div className="h-100 p-1 d-flex flex-column">
        <div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name="textType"
                value="json"
                checked={this.state.textType === "json"}
                onChange={this.onChangeTextType}
              />
              json
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name="textType"
                value="xml"
                checked={this.state.textType === "xml"}
                onChange={this.onChangeTextType}
              />
              xml
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name="textType"
                value="text"
                checked={this.state.textType === "text"}
                onChange={this.onChangeTextType}
              />
              text
            </label>
          </div>
        </div>
        <div
          className="h-100 p-2 form-control flex-grow-1 overflow-auto"
          style={{ whiteSpace: "pre" }}
          contentEditable="true"
          ref={this.valueRef}
          onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.ctrlKey && e.shiftKey && e.key == "F") {
              this.pretty();
            } else if (e.key == "{") {
            } else if (e.key == "[") {
            }
          }}
          dangerouslySetInnerHTML={{ __html: this.renderValue() }}
        ></div>
      </div>
    );
  }

  render() {
    return this.renderBody();
  }
}
