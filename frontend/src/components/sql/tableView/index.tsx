import React, { RefObject } from "react";
import guid from "../../../common/guid";
import "./style.scss";

export default class TableView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderHeader() {
    const header = this.props.header;

    if (!header || !header.length) {
      return null;
    }

    return (
      <thead className="table-light">
        <tr>
          {header.map((columnName: string) => (
            <th key={guid()}>{columnName}</th>
          ))}
        </tr>
      </thead>
    );
  }

  renderBody() {
    const data = this.props.data;
    const clickHandler = this.props.onClick || function () {};

    if (!data || !data.length) {
      return null;
    }

    return (
      <tbody>
        {data.map((row: string[], i: number) => (
          <tr key={guid()} onClick={() => clickHandler(row)}>
            {row.map((cell: string, j) => (
              <td key={guid()}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  render() {
    return (
      <table className="table table-hover table-bordered table-sm">
        {this.renderHeader()}
        {this.renderBody()}
      </table>
    );
  }
}
