import React, { RefObject } from "react";
import Jsql from "../../jsql";
import DBTableList from "../dbTableList";
import ColumnMapper from "../columnMapper";
import axios from "axios";
import TableView from "../../tableView";

export default class ExcelLoader extends React.Component<any, any> {
  private targetColumnRef: RefObject<ColumnMapper> =
    React.createRef<ColumnMapper>();

  constructor(props: any) {
    super(props);

    this.state = {
      startRow: 0,
      startCol: 0,
      uploadedPath: "",
      excelData: [],
      targetName: "",
      targetOwner: "",
      targetTableName: "",
    };
  }

  run() {
    if (!window.confirm("데이터 등록을 실행합니다.")) {
      return;
    }

    const targetInfo = this.targetColumnRef.current.getMappingInfo();

    const jsondata = {
      path: this.state.uploadedPath,
      startRow: this.state.startRow,
      startCol: this.state.startCol,
      targetName: targetInfo.name,
      targetOwner: targetInfo.owner,
      targetTableName: targetInfo.tableName,
      targetColumns: targetInfo.mappingColumns,
    };

    axios.post("/api/dataloader/excel", jsondata);
  }

  handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      this.setState({ file: e.target.files[0] });
    }
  }

  handlelUpload() {
    let file = this.state.file;

    if (!file) {
      window.alert("선택된 파일이 없습니다.");
      return;
    }

    console.log(file);

    let formData = new FormData(); // formData 객체를 생성한다.
    formData.append("file", file);

    axios({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: "/api/dataloader/excel-file",
      method: "POST",
      data: formData,
    }).then((res: any) => {
      let data = res.data;

      this.setState({
        uploadedPath: data.path,
      });

      this.forceUpdate(() => {
        this.readExcel(0, 100);
      });
    });
  }

  readExcel(offset: number, limit: number) {
    axios
      .get("/api/dataloader/excel-file", {
        params: {
          path: this.state.uploadedPath,
        },
      })
      .then((res) => {
        let data = res.data;

        this.setState({
          excelData: data.result,
        });
      });
  }

  render() {
    return (
      <div className="w-100 h-100 d-flex flex-column">
        <div
          className="d-flex flex-row"
          style={{ height: "200px", minHeight: "200px" }}
        >
          <div className="flex-grow-1 p-2">
            <input
              type="file"
              multiple={false}
              accept=".xlsx"
              onChange={(e) => this.handleFileChange(e)}
            />
            <button
              className="btn btn-primary btn-sm me-1"
              onClick={(e) => this.handlelUpload()}
            >
              업로드
            </button>
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
              <div className="input-group col-auto">
                <span className="input-group-text">Row</span>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.startRow}
                  min={0}
                  placeholder="row"
                  onChange={(e) => {
                    this.setState({
                      startRow: e.target.value
                    });
                  }}
                />
                <span className="input-group-text">Col</span>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.startCol}
                  min={0}
                  placeholder="col"
                  onChange={(e) => {
                    this.setState({
                      startCol: e.target.value
                    });
                  }}
                />
              </div>
              <TableView header={[]} data={this.state.excelData}></TableView>
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
