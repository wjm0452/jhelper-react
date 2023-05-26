import React, { RefObject } from "react";
import axios from "axios";
import Jsql from "../jsql";
import TextTokenizer from "../../../common/textTokenizer";
import CacheContext from "../../../common/cacheContext";
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
        <thead className="table-light">
          <tr>
            {header.map((columnName: string) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        {
          <tbody>
            {data.map((row: string[], i: number) => (
              <tr key={i} onClick={() => clickHandler(row)}>
                {row.map((cell: string, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </table>
    );
  }
}
