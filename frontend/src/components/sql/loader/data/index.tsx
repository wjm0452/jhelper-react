import React, { RefObject } from "react";
import Jsql from "../../jsql";
import DBTableList from "../dbTableList";
import ColumnMapper from "../columnMapper";
import axios from "axios";

export default class DataLoader extends React.Component<any, any> {
  private jsql: Jsql;

  private sourceColumnRef: RefObject<ColumnMapper>;
  private targetColumnRef: RefObject<ColumnMapper>;

  constructor(props: any) {
    super(props);
    this.jsql = new Jsql({
      url: "/api/sql",
    });

    this.state = {
      sourceQuery: "",
      sourceName: "",
      sourceOwner: "",
      sourceTableName: "",
      sourceColumns: [],
      targetName: "",
      targetOwner: "",
      targetTableName: "",
      targetColumns: [],
    };

    this.sourceColumnRef = React.createRef<ColumnMapper>();
    this.targetColumnRef = React.createRef<ColumnMapper>();
  }

  loadData() {
    const targetInfo = this.targetColumnRef.current.getMappingInfo();
    const sourceInfo = this.sourceColumnRef.current.getMappingInfo();

    const sourceColumns = sourceInfo.mappingColumns
      .map((column: string) => column)
      .join(",\r\n       ");

    const sourceQuery = `select ${sourceColumns}\r\n  from ${sourceInfo.owner}.${sourceInfo.tableName}`;

    this.setState({
      sourceQuery: sourceQuery,
      sourceName: sourceInfo.name,
      sourceOwner: sourceInfo.owner,
      sourceTableName: sourceInfo.tableName,
      sourceColumns: sourceInfo.mappingColumns,
      targetName: targetInfo.name,
      targetOwner: targetInfo.owner,
      targetTableName: targetInfo.tableName,
      targetColumns: targetInfo.mappingColumns,
    });
  }

  run() {
    if (!window.confirm("데이터 등록을 실행합니다.")) {
      return;
    }

    const state = this.state;

    const jsondata = {
      sourceName: state.sourceName,
      sourceOwner: state.sourceOwner,
      sourceTableName: state.sourceTableName,
      sourceQuery: state.sourceQuery,
      targetName: state.targetName,
      targetOwner: state.targetOwner,
      targetTableName: state.targetTableName,
      targetColumns: state.targetColumns,
    };

    axios.post("/api/dataloader", jsondata);
  }

  render() {
    return (
      <div className="w-100 h-100 d-flex flex-column">
        <div
          className="d-flex flex-row"
          style={{ height: "200px", minHeight: "200px" }}
        >
          <div className="flex-grow-1 p-2">
            <DBTableList
              onClick={(source: any) => {
                this.sourceColumnRef.current?.setData(source);
              }}
            />
          </div>
          <div className="flex-grow-1 p-2">
            <DBTableList
              onClick={(source: any) => {
                this.targetColumnRef.current?.setData(source);
              }}
            />
          </div>
        </div>
        <div className="flex-grow-1 d-flex flex-row overflow-hidden">
          <div
            className="flex-grow-1 p-2 overflow-hidden"
            style={{ width: "50%" }}
          >
            <div className="h-100 d-flex flex-column">
              <div className="flex-grow-1 overflow-auto">
                <ColumnMapper
                  ref={this.sourceColumnRef}
                  editable={true}
                ></ColumnMapper>
              </div>
              <div className="flex-shrink-0">
                <div className="text-end mt-1">
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={(e) => {
                      this.loadData();
                    }}
                  >
                    쿼리생성
                  </button>
                </div>
                <div className="mt-1" style={{ height: "250px" }}>
                  <textarea
                    className="form-control w-100 h-100"
                    value={this.state.sourceQuery}
                    onChange={(e) => {
                      this.setState({
                        sourceQuery: e.target.value,
                      });
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex-grow-1 p-2 overflow-hidden"
            style={{ width: "50%" }}
          >
            <div className="h-100 overflow-auto">
              <ColumnMapper ref={this.targetColumnRef}></ColumnMapper>
            </div>
          </div>
        </div>
        <div>
          <div className="p-2">
            <div className="text-end">
              <button
                className="btn btn-primary btn-sm me-1"
                onClick={(e) => {
                  this.run();
                }}
              >
                실행
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
