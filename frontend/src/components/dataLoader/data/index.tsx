import React, { RefObject } from "react";
import DBTableList from "../dbTableList";
import ColumnMapper from "../columnMapper";
import httpClient from "../../../common/httpClient";

export default class DataLoader extends React.Component<any, any> {
  private sourceColumnRef: RefObject<ColumnMapper>;
  private targetColumnRef: RefObject<ColumnMapper>;

  constructor(props: any) {
    super(props);

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

    httpClient.post("/api/dataloader", jsondata);
  }

  render() {
    return (
      <div className="h-100 p-2">
        <div
          className="grid h-100"
          style={{
            "--bs-rows": 4,
            "--bs-columns": 2,
            "grid-template-rows": "1fr 2fr auto auto",
          }}
        >
          <div className="g-col overflow-auto">
            <DBTableList
              onClick={(source: any) => {
                this.sourceColumnRef.current?.setData(source);
              }}
            />
          </div>
          <div className="g-col overflow-auto">
            <DBTableList
              onClick={(source: any) => {
                this.targetColumnRef.current?.setData(source);
              }}
            />
          </div>
          <div className="g-col overflow-auto" style={{ "grid-row": 2 }}>
            <ColumnMapper
              ref={this.sourceColumnRef}
              editable={true}
            ></ColumnMapper>
          </div>
          <div className="g-col overflow-auto" style={{ "grid-row": 2 }}>
            <ColumnMapper ref={this.targetColumnRef}></ColumnMapper>
          </div>
          <div className="g-col" style={{ "grid-row": 3 }}>
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
            <div style={{ height: "250px" }}>
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
          <div className="g-col" style={{ "grid-row": 3 }}></div>
          <div className="g-col-2 text-end" style={{ "grid-row": 4 }}>
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
    );
  }
}
