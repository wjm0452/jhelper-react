import React from "react";

export default class ColumnMapper extends React.Component<any, any> {
  private selectedIndex = -1;
  private editable = false;

  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      owner: "",
      tableName: "",
      columnNames: [],
      items: [],
    };

    if (props.editable) {
      this.editable = props.editable;
    }
  }

  setData(data: any) {
    const columns = data.columns;
    this.setState({
      name: data.name,
      owner: data.owner,
      tableName: data.tableName,
      columnNames: columns.columnNames,
      items: columns.result,
    });
  }

  getMappingInfo() {
    const state = this.state;

    const mappingColumns = state.items.map((item: string[]) => {
      return item[1];
    });

    return {
      name: state.name,
      owner: state.owner,
      tableName: state.tableName,
      mappingColumns,
    };
  }

  appendRow() {
    var items = this.state.items;
    items.push(["", "", "", "", ""]);
    this.setState({ items });
  }

  deleteRow(idx: number) {
    var items = this.state.items;
    items.splice(idx, 1);
    this.setState({ items });
  }

  moveRowUp() {
    if (this.selectedIndex == -1 || this.selectedIndex == 0) {
      return;
    }

    const items = this.state.items;
    const target = items[this.selectedIndex];

    items.splice(this.selectedIndex, 1);
    items.splice(this.selectedIndex - 1, 0, target);

    this.selectedIndex--;

    this.setState({ items });
  }

  moveRowDown() {
    const items = this.state.items;

    if (this.selectedIndex == -1 || this.selectedIndex == items.length - 1) {
      return;
    }

    const target = items[this.selectedIndex];

    items.splice(this.selectedIndex, 1);
    items.splice(this.selectedIndex + 1, 0, target);

    this.selectedIndex++;

    this.setState({ items });
  }

  renderEditButton() {
    return (
      <div className="text-end">
        <button
          className="btn btn-primary btn-sm me-1"
          onClick={(e) => {
            this.appendRow();
          }}
        >
          ADD
        </button>
        <button
          className="btn btn-secondary btn-sm me-1"
          onClick={(e) => {
            this.moveRowUp();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        </button>
        <button
          className="btn btn-secondary btn-sm me-1"
          onClick={(e) => {
            this.moveRowDown();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
            />
          </svg>
        </button>
      </div>
    );
  }

  render() {
    const header = this.state.columnNames;
    const items = this.state.items;

    return (
      <div>
        {this.editable ? (
          <div style={{ height: "35px" }}>{this.renderEditButton()}</div>
        ) : (
          <div />
        )}
        <table className="table table-hover table-bordered table-sm mt-1">
          <thead className="table-light">
            <tr className="text-center">
              <th>No</th>
              {header.map((columnName: string, i: number) => (
                <th key={`head_${i}`}>{columnName}</th>
              ))}
              {this.editable && header.length > 0 ? <th>삭제</th> : null}
            </tr>
          </thead>
          {
            <tbody>
              {items.map((row: string[], i: number) => (
                <tr
                  key={`head_${i}`}
                  style={{ lineHeight: "32px" }}
                  onClick={(e) => {
                    this.selectedIndex = i;
                  }}
                >
                  <td className="text-end">{i + 1}</td>
                  <td>{row[0]}</td>
                  <td>
                    {this.editable ? (
                      <input
                        type="text"
                        className="h-100 w-100"
                        onChange={(e) => {
                          this.state.items[i][1] = e.target.value;
                          this.setState({ items: this.state.items });
                        }}
                        value={row[1]}
                      />
                    ) : (
                      row[1]
                    )}
                  </td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  {this.editable ? (
                    <th className="text-center">
                      <button
                        className="btn btn-secondary btn-sm me-1"
                        onClick={() => this.deleteRow(i)}
                      >
                        삭제
                      </button>
                    </th>
                  ) : null}
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    );
  }
}
