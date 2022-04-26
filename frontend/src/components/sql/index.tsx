import React from "react";
import axios from "axios";
import Jsql from "./jsql";
import TextTokenizer from "../../common/textTokenizer";
import CacheContext from "../../common/cacheContext";
import "./style.scss";

async function runSql(query: string) {
  var res: any = await axios.post("/api/sql", { query });
  return res.data;
}

export default class Query extends React.Component<any, any> {

  private jsql: Jsql;
  private sqlElement: any;

  private cacheContext: CacheContext;

  constructor(props: any) {
    super(props);

    this.sqlElement = React.createRef<any>();
    this.jsql = new Jsql({
      tablePrefix: 'T_',
      url: '/api/sql'
    });

    this.state = {
      vendor: "",
      owner: "",
      tableName: "",

      query: "",

      selectedTableName: "",
      columnName: "",

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
  }

  componentDidMount() {

    this.cacheContext.loadCache(["vendor", "owner"]).then(() => {
      if (this.state.vendor) {
        this.loadTemplate(this.state.vendor);
      }
    });

    this.cacheContext.getCache('query').then((value) => {
      this.sqlElement.current.value = value;
    });
  }

  loadTemplate(value: string) {
    this.jsql.loadTemplate(value).then(() => {
      if (this.state.owner) {
        this.fetchTables();
      }
    });
  }

  fetchTables() {
    var data = {
      owner: this.state.owner,
      tableName: this.state.tableName
    };

    this.jsql.findTableInfo(data).then((data: any) => {
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

    this.jsql.findColumnInfo(data).then((data: any) => {
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
      }
    });
  }

  renderColumns() {
    return this.renderTable({
      data: this.state.columns,
    });
  }

  renderResults() {
    return this.renderTable({
      data: this.state.sqlResults
    });
  }

  renderTable(options: any) {

    const data = options.data;
    const columnNames = data.columnNames || [];
    const result = data.result || [];

    const clickHandler = options.click || function () { };

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

    runSql(query).then((data: any) => {
      this.setState({ sqlResults: data });
    });
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
        <div className="flex-grow-0 flex-shrink-1 d-flex flex-column p-2" style={{ maxWidth: "500px" }}>
          <div className="flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="row g-3">
              <div className="col-auto">
                <select className="form-control" value={this.state.vendor} onChange={(e) => {
                  this.cacheContext.setState({ vendor: e.currentTarget.value });
                  this.loadTemplate(e.currentTarget.value);
                }}>
                  <option value="">Vendor</option>
                  <option value="oracle">oracle</option>
                  <option value="db2">db2</option>
                </select>
              </div>
              <div className="col-auto">
                <input type="text"
                  className="form-control"
                  value={this.state.owner}
                  placeholder="owner"
                  onChange={(e) => {
                    this.cacheContext.setState({ owner: e.currentTarget.value });
                  }}
                  onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      this.fetchTables();
                    }
                  }} />
              </div>
              <div className="col-auto">
                <input type="text"
                  className="form-control"
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
                <button className="btn btn-primary btn-sm" onClick={(e) => {
                  this.fetchTables();
                }}>find</button>
              </div>
            </div>
            <div className="mt-1 overflow-auto">
              {this.renderTables()}
            </div>
          </div>
          <div className="mt-2">
            <div>
              <div className="row g-3">
                <div className="col-auto">
                  <input type="text" className="form-control" value={this.state.selectedTableName} placeholder="table" onChange={(e) => {
                    this.setState({ selectedTableName: e.currentTarget.value });
                  }} />
                </div>
                <div className="col-auto">
                  <input type="text"
                    className="form-control"
                    placeholder="column"
                    onChange={(e) => {
                      this.setState({ columnName: e.currentTarget.value });
                    }}
                    onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        this.fetchColumns();
                      }
                    }} />
                </div>
                <div className="col-auto">
                  <button className="btn btn-primary btn-sm" onClick={(e) => {
                    this.fetchColumns();
                  }}>find</button>
                </div>
              </div>
              <div className="mt-1 overflow-auto" style={{ height: "300px" }}>
                {this.renderColumns()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow-1 flex-shrink-1 d-flex flex-column overflow-auto p-2" style={{ minWidth: "500px" }}>
          <div>
            <button className="btn btn-primary btn-sm" onClick={() => this.onSql()} >
              run
            </button>
          </div>
          <div className="flex-grow-1 mt-1">
            <textarea
              className="form-control w-100 h-100"
              ref={this.sqlElement}
              onChange={(e) => { this.cacheContext.setCache('query', e.currentTarget.value); }}
              onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.ctrlKey && e.key === "Enter") {
                  this.onSql();
                }
              }}
            ></textarea>
          </div>
          <div className="mt-1 overflow-auto" style={{ height: "350px" }}>{this.renderResults()}</div>
          <div>
            <span>{this.state.sqlResults.result.length}</span> fetched rows
          </div>
        </div>
      </div >
    );
  }
}
