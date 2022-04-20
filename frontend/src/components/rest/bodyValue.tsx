import React, { RefObject } from "react";
import prettyJson from "../../common/prettyJson";

export default class BodyValue extends React.Component<any, any> {
  private valueRef: RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
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
      value = prettyJson(value);
      this.setValue(value);
    } catch (e) {
      console.log("error");
    }
  }

  renderValue() {
    const value = this.state.value;
    let lines: string[] = value.split(/\r\n|\n/g);

    return lines.map((line, i) => <div key={i}>{line}</div>);
  }

  renderBody() {
    return (
      <div className="h-100 p-1">
        <div
          className="h-100 p-2 form-control overflow-auto"
          style={{ whiteSpace: "pre" }}
          contentEditable="true"
          ref={this.valueRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.ctrlKey && e.shiftKey && e.key == "F") {
              this.pretty();
            } else if (e.key == "{") {
            } else if (e.key == "[") {
            }
          }}
          suppressContentEditableWarning={true}
        >{this.renderValue()}</div>
      </div>
    );
  }

  render() {
    return this.renderBody();
  }
}
