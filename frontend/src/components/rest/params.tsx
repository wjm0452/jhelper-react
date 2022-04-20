import React from "react";

export default class Params extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { data: props.data || [] };
  }

  setData(data: any | any[]) {
    if (Array.isArray(data)) {
      this.setState({ data });
    } else {
      const array = [];

      for (const [key, value] of Object.entries(data)) {
        array.push({ key, value });
      }

      this.setState({ data: array });
    }
  }

  getData() {
    return this.state.data;
  }

  updateKey(i: any, value: string) {
    var data = this.state.data;
    data[i].key = value;
    this.setState({ data });
  }

  updateValue(i: any, value: string) {
    var data = this.state.data;
    data[i].value = value;
    this.setState({ data });
  }

  appendRow() {
    var data = this.state.data;
    data.push({});
    this.setState({ data });
  }

  deleteRow(idx: number) {
    var data = this.state.data;
    data.splice(idx, 1);
    this.setState({ data });
  }

  renderBody() {
    return this.state.data.map((item: any, i: number) => (
      <tr key={i}>
        <td>
          <input
            type="text"
            className="form-control"
            value={item.key || ""}
            onChange={(e) => this.updateKey(i, e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control"
            value={item.value || ""}
            onChange={(e) => this.updateValue(i, e.target.value)}
          />
        </td>
        <td className="align-middle">
          <button
            className="btn-close"
            onClick={() => this.deleteRow(i)}
          ></button>
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <div className="h-100 d-flex flex-column">
        <div className="d-flex flex-row mt-3">
          <div className="flex-grow-1">
            <h5 className="fw-bold">Params</h5>
          </div>
          <div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => this.appendRow()}
            >
              ADD
            </button>
          </div>
        </div>
        <div className="flex-grow-1 overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">KEY</th>
                <th scope="col">VALUE</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{this.renderBody()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
