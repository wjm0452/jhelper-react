import React, { RefObject } from "react";
import guid from "../../../common/guid";
//import "./style.scss";

export default class ColumnMapping extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      owner: "",
      tableName: "",
      columnNames: [],
      result: [],
    };
  }

  setData(data: any) {
    const columns = data.columns;
    this.setState({
      name: data.name,
      owner: data.owner,
      tableName: data.tableName,
      columnNames: columns.columnNames,
      result: columns.result,
    });
  }

  getData() {
    const state = this.state;

    return {
      name: state.name,
      owner: state.owner,
      tableName: state.tableName,
      columnNames: state.columnNames,
      result: state.result,
    };
  }

  appendRow() {
    var result = this.state.resultresult;
    result.push({});
    this.setState({ result });
  }

  deleteRow(idx: number) {
    var result = this.state.result;
    result.splice(idx, 1);
    this.setState({ result });
  }

  render() {
    const header = this.state.columnNames;
    const data = this.state.result;

    return (
      <table className="table table-hover table-bordered table-sm">
        <thead className="table-light">
          <tr>
            {header.map((columnName: string) => (
              <th key={guid()}>{columnName}</th>
            ))}
            {header.length > 0 ? <th>삭제</th> : null}
          </tr>
        </thead>
        {
          <tbody>
            {data.map((row: string[], i: number) => (
              <tr key={guid()}>
                {row.map((cell: string, j) => (
                  <td key={guid()}>{cell}</td>
                ))}
                <th className="text-center">
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => this.deleteRow(i)}
                  >
                    삭제
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        }
      </table>
    );
  }
}
