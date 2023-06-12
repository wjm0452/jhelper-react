import React from "react";
import axios from "axios";
import Jsql from "../jsql";
import TableView from "../tableView";

async function readConnections() {
  const res = await axios.get(`/api/conn-info`);
  const data = res.data;

  return data;
}

export default class DBTableList extends React.Component<any, any> {
  private jsql: Jsql;

  constructor(props: any) {
    super(props);
    this.jsql = new Jsql({
      url: "/api/sql",
    });

    this.state = {
      name: "",
      owner: "",
      tableName: "",
      tables: {
        columnNames: [],
        result: [],
      },
      connections: [],
    };
  }

  componentDidMount() {
    Promise.all([this.fetchConnections()]).then(() => {
      const name = this.state.name;
      if (name) {
        return this.loadTemplateByName(name);
      }
    });
  }

  loadTemplate(vendor: string) {
    this.jsql.loadTemplate(vendor).then(() => {
      if (this.state.owner) {
        this.fetchTables();
      }
    });
  }

  loadTemplateByName(name: string) {
    if (!name) {
      return;
    }
    var conn = this.state.connections.find((conn: any) => conn.name == name);
    return this.loadTemplate(conn.vendor);
  }

  onChangeConnections() {
    this.fetchConnections();
  }

  fetchConnections() {
    return readConnections().then((connections) => {
      this.setState({ connections });
    });
  }

  fetchTables() {
    var data = {
      owner: this.state.owner,
      tableName: this.state.tableName,
    };

    var name = this.state.name;

    return this.jsql.findTableInfo(data, { name }).then((data: any) => {
      this.setState({
        selectedOwner: this.state.owner,
        tables: data,
      });
    });
  }

  fetchColumns(tableName: string) {
    var data = {
      owner: this.state.selectedOwner,
      tableName: tableName,
      columnName: this.state.columnName,
    };

    var name = this.state.name;

    return this.jsql.findColumnInfo(data, { name }).then((data: any) => {
      return data;
    });
  }

  onClickTables(item: any[]) {
    const tableName: string = item[0];

    this.setState({ selectedTableName: tableName });
    this.fetchColumns(tableName).then((data) => {
      if (this.props.onClick) {
        var source = {
          name: this.state.name,
          owner: this.state.selectedOwner,
          tableName: tableName,
          columns: data,
        };

        this.props.onClick(source);
      }
    });
  }

  render() {
    return (
      <div className="flex-grow-1">
        <div className="row g-1">
          <div className="col-auto">
            <select
              className="form-select"
              value={this.state.name}
              onChange={(e) => {
                this.setState({
                  name: e.currentTarget.value,
                });
                this.loadTemplateByName(e.currentTarget.value);
              }}
            >
              <option value=""></option>
              {this.state.connections.map((conn: any) => {
                return (
                  <option key={conn.name} value={conn.name}>
                    {conn.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              style={{ width: "10rem" }}
              value={this.state.owner}
              placeholder="owner"
              onChange={(e) => {
                this.setState({
                  owner: e.currentTarget.value,
                });
              }}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  this.fetchTables();
                }
              }}
            />
          </div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              style={{ width: "10rem" }}
              value={this.state.tableName}
              placeholder="table"
              onChange={(e) => {
                this.setState({ tableName: e.currentTarget.value });
              }}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  this.fetchTables();
                }
              }}
            />
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary btn-sm me-1"
              onClick={(e) => {
                this.fetchTables();
              }}
            >
              find
            </button>
          </div>
        </div>
        <div className="mt-1 overflow-auto">
          <TableView
            header={this.state.tables.columnNames}
            data={this.state.tables.result}
            onClick={(item: any[]) => {
              this.onClickTables(item);
            }}
          ></TableView>
        </div>
      </div>
    );
  }
}
