import React, { RefObject } from "react";
import guid from "../../../common/guid";
import "./style.scss";

export default class TableView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const header = this.props.header;
    const data = this.props.data;
    const clickHandler = this.props.onClick || function () {};

    return (
      <table className="table table-hover table-bordered table-sm">
        {header && header.length ? (
          <thead className="table-light">
            <tr>
              {header.map((columnName: string) => (
                <th key={guid()}>{columnName}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        {
          <tbody>
            {data.map((row: string[], i: number) => (
              <tr key={guid()} onClick={() => clickHandler(row)}>
                {row.map((cell: string, j) => (
                  <td key={guid()}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </table>
    );
  }
}
