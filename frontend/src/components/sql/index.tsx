import React, { RefObject } from "react";
import axios from "axios";
import Jsql from "./jsql";
import TextTokenizer from "../../common/textTokenizer";
import CacheContext from "../../common/cacheContext";
import ConnManager from "./connManager";
import TableView from "./tableView";

async function runSql(query: string, params: any) {
  try {
    var res: any = await axios.post("/api/sql", { query, ...params });
    return res.data;
  } catch (e) {
    throw e;
  }
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

      fetchSize: 100,

      executeQuery: "",
      realExecuteQuery: "",

      selectedOwner: "",
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
      sqlState: "",
      errorMessage: "",
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

    this.jsql
      .findTableInfo(data, { name })
      .then((data: any) => {
        this.setState({
          selectedOwner: this.state.owner,
          tables: data,
        });
      })
      .catch((e) => {
        console.error(e);
        const response = e.response;

        if (response && response.data) {
          const data = response.data;
          alert(`[${data.sqlState}] ${data.errorMessage}`);
        } else {
          alert("오류가 발생하였습니다.");
        }

        return e;
      });
  }

  fetchColumns() {
    var data = {
      owner: this.state.selectedOwner,
      tableName: this.state.selectedTableName,
      columnName: this.state.columnName,
    };

    var name = this.state.name;

    this.jsql
      .findColumnInfo(data, { name })
      .then((data: any) => {
        this.setState({
          columns: data,
        });
      })
      .catch((e) => {
        console.error(e);
        const response = e.response;

        if (response && response.data) {
          const data = response.data;
          alert(`[${data.sqlState}] ${data.errorMessage}`);
        } else {
          alert("오류가 발생하였습니다.");
        }

        return e;
      });
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
    query = query.trim();
    if (query.endsWith(";")) {
      query = query.substring(0, query.lastIndexOf(";"));
    }

    console.log("runSql %s", query);

    const name = this.state.name;
    const fetchSize = this.state.fetchSize;
    const executeQuery = query;

    // if (limit > 0) {
    //   query = `${query} offset ${offset} rows fetch next ${limit} rows only`;
    // }

    this.setState(
      {
        executeQuery: executeQuery,
        realExecuteQuery: query,
        sqlResults: {
          columnNames: [],
          result: [],
        },
        sqlState: "",
        errorMessage: "",
      },
      () => {
        runSql(query, { name, fetchSize })
          .then((data: any) => {
            this.setState({ sqlResults: data });
          })
          .catch((e) => {
            console.error(e);

            let sqlState = "";
            let errorMessage = "";

            const response = e.response;

            if (response) {
              const data = response.data;

              if (data && data.sqlState) {
                sqlState = data.sqlState;
                errorMessage = data.errorMessage;
              } else {
                sqlState = "-1";
                errorMessage = e.toString();
              }
            } else {
              sqlState = "-1";
              errorMessage = e.toString();
            }

            this.setState({
              sqlState,
              errorMessage,
            });
          });
      }
    );
  }

  writeQuery(query: string) {
    var oldQuery = this.sqlElement.current.value;

    query = query.trim();
    if (!query.trim().endsWith(";")) {
      query += "\n;";
    }

    this.sqlElement.current.value = query + "\n" + oldQuery;
  }

  exportExcel() {
    let executeQuery = this.state.executeQuery;

    if (!executeQuery || !executeQuery.toLowerCase().startsWith("select")) {
      alert("조회 후 사용해 주세요.");
      return;
    }

    var name = this.state.name;
    console.log(executeQuery);

    axios({
      method: "post",
      url: "/api/sql-export",
      responseType: "blob",
      data: { query: executeQuery, name },
    }).then((res) => {
      this.downloadFile(res, "sql_result.xlsx");
    });
  }

  exportText() {
    let executeQuery = this.state.executeQuery;

    if (!executeQuery || !executeQuery.toLowerCase().startsWith("select")) {
      alert("조회 후 사용해 주세요.");
      return;
    }

    var name = this.state.name;
    console.log(executeQuery);

    axios({
      method: "post",
      url: "/api/sql-export/text",
      responseType: "blob",
      data: { query: executeQuery, name },
    }).then((res) => {
      this.downloadFile(res, "sql_result.txt");
    });
  }

  downloadFile(res: any, downloadName: any) {
    const blob = new Blob([res.data]);
    const fileObjectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileObjectUrl;
    link.style.display = "none";

    link.download = ((res) => {
      const disposition = res.headers["content-disposition"] || "";

      if (disposition.indexOf("filename") > -1) {
        let fileName = disposition.substring(disposition.indexOf("filename"));
        return fileName.split("=")[1].replace(/\"/g, "");
      }

      return downloadName;
    })(res);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(fileObjectUrl);
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
          style={{ maxWidth: "500px", minWidth: "500px" }}
        >
          <div className="flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="row g-1">
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
            <div className="mt-1 overflow-auto">
              <TableView
                header={this.state.tables.columnNames}
                data={this.state.tables.result}
                onClick={(item: any[]) => {
                  this.setState({ selectedTableName: item[0] });
                  Promise.resolve().then(() => this.fetchColumns());
                }}
              ></TableView>
            </div>
          </div>
          <div className="mt-2">
            <div>
              <div className="row g-1">
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
                        owner: this.state.selectedOwner,
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
                        owner: this.state.selectedOwner,
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
                        owner: this.state.selectedOwner,
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
                        owner: this.state.selectedOwner,
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
                <TableView
                  header={this.state.columns.columnNames}
                  data={this.state.columns.result}
                ></TableView>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex-grow-1 flex-shrink-1 d-flex flex-column overflow-auto p-2"
          style={{ minWidth: "500px" }}
        >
          <div className="row g-1">
            <div className="col-auto input-group">
              <span className="input-group-text">Fetch Size</span>
              <input
                type="number"
                className="form-control"
                min={-1}
                value={this.state.fetchSize}
                onChange={(e) => {
                  this.setState({
                    fetchSize: e.target.value,
                  });
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={() => {
                  this.sqlElement.current.value = "";
                  this.sqlElement.current.focus();
                }}
              >
                clear
              </button>
              <button className="btn btn-primary" onClick={() => this.onSql()}>
                run
              </button>
            </div>
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
            <TableView
              header={this.state.sqlResults.columnNames}
              data={this.state.sqlResults.result}
            ></TableView>
            <div style={{ display: this.state.sqlState ? "" : "none" }}>
              <div>{this.state.sqlState}</div>
              <div>{this.state.errorMessage}</div>
            </div>
          </div>
          <div>
            <div className="d-inline-block">
              <span>{this.state.sqlResults.result.length}</span> fetched rows
            </div>
            <div className="float-end">
              <button
                className="btn btn-primary btn-sm me-1"
                onClick={(e) => {
                  this.exportExcel();
                }}
              >
                excel
              </button>
              <button
                className="btn btn-primary btn-sm me-1"
                onClick={(e) => {
                  this.exportText();
                }}
              >
                text
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
