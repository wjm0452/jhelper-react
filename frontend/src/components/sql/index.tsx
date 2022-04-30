import React, { RefObject } from "react";
import axios from "axios";
import Jsql from "./jsql";
import TextTokenizer from "../../common/textTokenizer";
import CacheContext from "../../common/cacheContext";
import "./style.scss";
import ConnManager from "./connManager";

async function runSql(query: string, params: any) {
  var res: any = await axios.post("/api/sql", { query, ...params });
  return res.data;
}

async function readConnections() {
  const res = await axios.get(`/api/conn-info`);
  const data = res.data;

  return data;
}

export default class Query extends React.Component<any, any> {
  private jsql: Jsql;
  private sqlElement: any;

  private cacheContext: CacheContext;
  private connManagerRef: RefObject<ConnManager>;

  constructor(props: any) {
    super(props);

    this.sqlElement = React.createRef<any>();
    this.jsql = new Jsql({
      url: "/api/sql",
    });

    this.state = {
      name: "",
      owner: "",
      tableName: "",

      query: "",

      selectedTableName: "",
      columnName: "",

      connections: [],

      tables: {
        columnNames: [],
        result: [],
      },
      columns: {
        columnNames: [],
        result: [],
      },
      sqlResults: {
        columnNames: [],
        result: [],
      },
    };

    this.cacheContext = new CacheContext(this);
    this.connManagerRef = React.createRef<ConnManager>();
  }

  componentDidMount() {
    Promise.all([
      this.fetchConnections(),
      this.cacheContext.loadCache(["name", "owner"]),
    ]).then(() => {
      const name = this.state.name;
      if (name) {
        return this.loadTemplateByName(name);
      }
    });

    this.cacheContext.getCache("query").then((value) => {
      this.sqlElement.current.value = value;
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

    this.jsql.findTableInfo(data, { name }).then((data: any) => {
      this.setState({
        tables: data,
      });
    });
  }

  fetchColumns() {
    var data = {
      owner: this.state.owner,
      tableName: this.state.selectedTableName,
      columnName: this.state.columnName,
    };

    var name = this.state.name;

    this.jsql.findColumnInfo(data, { name }).then((data: any) => {
      this.setState({
        columns: data,
      });
    });
  }

  renderTables() {
    return this.renderTable({
      data: this.state.tables,
      click: (item: any) => {
        this.setState({ selectedTableName: item[0] });
        Promise.resolve().then(() => this.fetchColumns());
      },
    });
  }

  renderColumns() {
    return this.renderTable({
      data: this.state.columns,
    });
  }

  renderResults() {
    return this.renderTable({
      data: this.state.sqlResults,
    });
  }

  renderTable(options: any) {
    const data = options.data;
    const columnNames = data.columnNames || [];
    const result = data.result || [];

    const clickHandler = options.click || function () {};

    return (
      <table className="table table-hover table-bordered table-sm">
        <thead className="table-light">
          <tr>
            {columnNames.map((columnName: string) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        {
          <tbody>
            {result.map((row: string[], i: number) => (
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

  onSql() {
    var element = this.sqlElement.current;
    var sql = element.value;

    var tokenizer = this.createSQLTokenizer(sql);

    var selection = element.selectionStart,
      start = 0,
      end = 0,
      pos = 0;

    while (tokenizer.hasNext()) {
      var str = tokenizer.next();

      pos += str.length;

      if (str == ";") {
        if (selection <= pos) {
          end = pos;
          break;
        } else if (pos <= selection) {
          start = pos;
        }
      }

      end = pos;
    }

    if (sql.charAt(start) == "\n") {
      start++;
    }

    element.setSelectionRange(start, end);

    this.runSql(sql.substring(start, end));
  }

  runSql(query: string) {
    console.log("runSql %s", query);
    var name = this.state.name;

    runSql(query, { name }).then((data: any) => {
      this.setState({ sqlResults: data });
    });
  }

  writeQuery(query: string) {
    var oldQuery = this.sqlElement.current.value;

    query = query.trim();
    if (!query.trim().endsWith(";")) {
      query += "\n;";
    }

    this.sqlElement.current.value = query + "\n" + oldQuery;
  }

  createSQLTokenizer(sql: string) {
    var cus: any = {};
    cus["/*"] = "*/";
    cus["/*+"] = "*/";
    cus["//"] = "\n";
    cus["'"] = "'";

    return new TextTokenizer(sql, cus);
  }

  render() {
    return (
      <div className="w-100 h-100 d-flex flex-row">
        <div>
          <ConnManager
            ref={this.connManagerRef}
            onChangeConnections={() => {
              this.onChangeConnections();
            }}
          ></ConnManager>
        </div>
        <div
          className="flex-grow-0 flex-shrink-1 d-flex flex-column p-2"
          style={{ maxWidth: "500px" }}
        >
          <div className="flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="row g-3">
              <div className="col-auto">
                <select
                  className="form-select"
                  value={this.state.name}
                  onChange={(e) => {
                    this.cacheContext.setState({
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
                    this.cacheContext.setState({
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
                <button
                  className="btn btn-secondary btn-sm me-1"
                  onClick={(e) => {
                    this.connManagerRef.current?.show();
                  }}
                >
                  settings
                </button>
              </div>
            </div>
            <div className="mt-1 overflow-auto">{this.renderTables()}</div>
          </div>
          <div className="mt-2">
            <div>
              <div className="row g-3">
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.selectedTableName}
                    placeholder="table"
                    onChange={(e) => {
                      this.setState({
                        selectedTableName: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="column"
                    onChange={(e) => {
                      this.setState({ columnName: e.currentTarget.value });
                    }}
                    onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        this.fetchColumns();
                      }
                    }}
                  />
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      this.fetchColumns();
                    }}
                  >
                    find
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => {
                      var data = {
                        owner: this.state.owner,
                        tableName: this.state.selectedTableName,
                      };

                      var name = this.state.name;

                      this.jsql.selectQuery(data, { name }).then((query) => {
                        this.writeQuery(query);
                      });
                    }}
                  >
                    select
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => {
                      var data = {
                        owner: this.state.owner,
                        tableName: this.state.selectedTableName,
                      };

                      var name = this.state.name;

                      this.jsql.insertQuery(data, { name }).then((query) => {
                        this.writeQuery(query);
                      });
                    }}
                  >
                    insert
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => {
                      var data = {
                        owner: this.state.owner,
                        tableName: this.state.selectedTableName,
                      };

                      var name = this.state.name;

                      this.jsql.updateQuery(data, { name }).then((query) => {
                        this.writeQuery(query);
                      });
                    }}
                  >
                    update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => {
                      var data = {
                        owner: this.state.owner,
                        tableName: this.state.selectedTableName,
                      };

                      var name = this.state.name;

                      this.jsql.deleteQuery(data, { name }).then((query) => {
                        this.writeQuery(query);
                      });
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
              <div className="mt-1 overflow-auto" style={{ height: "300px" }}>
                {this.renderColumns()}
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex-grow-1 flex-shrink-1 d-flex flex-column overflow-auto p-2"
          style={{ minWidth: "500px" }}
        >
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => this.onSql()}
            >
              run
            </button>
          </div>
          <div className="flex-grow-1 mt-1">
            <textarea
              className="form-control w-100 h-100"
              ref={this.sqlElement}
              onChange={(e) => {
                this.cacheContext.setCache("query", e.currentTarget.value);
              }}
              onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.ctrlKey && e.key === "Enter") {
                  this.onSql();
                }
              }}
            ></textarea>
          </div>
          <div className="mt-1 overflow-auto" style={{ height: "350px" }}>
            {this.renderResults()}
          </div>
          <div>
            <span>{this.state.sqlResults.result.length}</span> fetched rows
          </div>
        </div>
      </div>
    );
  }
}
