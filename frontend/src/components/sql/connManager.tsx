import React from "react";
import httpClient from "../../common/httpClient";

async function readData() {
  const res = await httpClient.get(`/api/conn-info`);
  const data = res.data;

  return data;
}

async function saveData(obj: {
  name: string;
  vendor: string;
  jdbcUrl: string;
  driverClassName: string;
  username: string;
  password: string;
}) {
  const res = await httpClient.put("/api/conn-info", obj);
  return res.data;
}

async function deleteData(id: number) {
  const res = await httpClient.delete(`/api/conn-info/${id}`);
  return res.data;
}

export default class ConnManager extends React.Component<any, any> {
  private changeConnectionsHandler: Function;

  constructor(props: any) {
    super(props);

    this.changeConnectionsHandler = props.onChangeConnections;

    this.state = {
      visible: false,
      connections: [],
      data: {
        name: "",
        vendor: "",
        jdbcUrl: "",
        driverClassName: "",
        username: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
    this.changeConnectionsHandler();
  }

  toggle() {
    this.setState({ visible: !this.state.visible });
  }

  fetchData() {
    readData().then((data) => {
      this.setState({ connections: data });
    });
  }

  saveData() {
    var data = this.state.data;

    if (
      !data.name ||
      !data.vendor ||
      !data.jdbcUrl ||
      !data.driverClassName ||
      !data.username ||
      !data.password
    ) {
      return;
    }

    var connections = this.state.connections;

    saveData(data).then((data) => {
      var idx = connections.findIndex((conn: any) => conn.name == data.name);

      if (idx == -1) {
        connections = [data, ...connections];
      } else {
        connections[idx] = data;
      }

      this.setState({
        data: {
          name: "",
          vendor: "",
          jdbcUrl: "",
          driverClassName: "",
          username: "",
          password: "",
        },
        connections,
      });
    });
  }

  deleteData(id: number) {
    var connections = this.state.connections;

    deleteData(id).then(() => {
      var idx = connections.findIndex((conn: any) => conn.name == id);

      if (idx == -1) {
        return;
      }

      connections.splice(idx, 1);
      this.setState({ connections });
    });
  }

  renderConnections() {
    var connections = this.state.connections;

    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">vendor</th>
            <th scope="col">jdbcUrl</th>
            <th scope="col">username</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn: any, i: number) => (
            <tr
              key={conn.name}
              onClick={() => {
                this.setState({ data: { ...conn } });
              }}
            >
              <th scope="row">{i + 1}</th>
              <td>{conn.name}</td>
              <td>{conn.vendor}</td>
              <td>{conn.jdbcUrl}</td>
              <td>{conn.username}</td>
              <td className="align-middle">
                <button
                  className="btn-close"
                  onClick={() => this.deleteData(conn.name)}
                ></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    var data = this.state.data;

    return (
      <div
        className="modal"
        style={{
          display: this.state.visible !== false ? "block" : "none",
        }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Connections</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => this.hide()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-row">
                <div className="flex-grow-1 p-1">
                  {this.renderConnections()}
                </div>
                <div className="flex-grow-0 p-1" style={{ flexBasis: "300px" }}>
                  <div className="mb-3">
                    <label className="form-label">name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={data.name}
                      onChange={(e) => {
                        data.name = e.target.value;
                        this.setState({ data });
                      }}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">vendor</label>
                    <select
                      className="form-select"
                      value={data.vendor}
                      onChange={(e) => {
                        data.vendor = e.currentTarget.value;
                        this.setState({ data });
                      }}
                    >
                      <option value="">Select</option>
                      <option value="oracle">oracle</option>
                      <option value="db2">db2</option>
                      <option value="mssql">mssql</option>
                      <option value="postgres">postgres</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">url</label>
                    <input
                      type="text"
                      className="form-control"
                      value={data.jdbcUrl}
                      onChange={(e) => {
                        data.jdbcUrl = e.target.value;
                        this.setState({ data });
                      }}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">driverClassName</label>
                    <input
                      type="text"
                      className="form-control"
                      value={data.driverClassName}
                      onChange={(e) => {
                        data.driverClassName = e.target.value;
                        this.setState({ data });
                      }}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={data.username}
                      onChange={(e) => {
                        data.username = e.target.value;
                        this.setState({ data });
                      }}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={data.password}
                      onChange={(e) => {
                        data.password = e.target.value;
                        this.setState({ data });
                      }}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.hide()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.saveData()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
