import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useRef, useState } from "react";
import TableView from "../common/tableViewer";
import { uploadFile } from "../common/uploader/uploader.api";
import ConnectionForm from "../sql/objectView/connectionForm";
import TablesView from "../sql/objectView/tablesView";
import { ConnectionStoreProvider } from "../sql/sql.context";
import EditableTableColumns from "./editableTableColumns";
import { loadExcelData, readExcel } from "./excelLoader.api";

const ExcelLoader = () => {
  const [startRow, setStartRow] = useState(0);
  const [startCol, setStartCol] = useState(0);
  const [uploadedPath, setUploadedPath] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [excelData, setExcelData] = useState([]);

  const [targetData, setTargetData] = useState({
    name: "",
    owner: "",
    tableName: "",
  });

  const targetColumnRef = useRef<any>();

  useEffect(() => {
    if (uploadedPath) {
      readExcel({ uploadedPath }).then((data) => {
        setExcelData(data.result);
        bindQueryParams(data.result, startRow, startCol);
      });
    }
  }, [uploadedPath, startRow, startCol]);

  const bindQueryParams = (excelData: string[], startRow: number, startCol: number) => {
    let queryParams = [];
    if (excelData.length) {
      const paramLength = excelData[startRow].length - startCol;
      if (paramLength > 0) {
        queryParams = new Array(paramLength);
        queryParams.fill("?");
      }
    }

    setQueryParams(queryParams.join(",\r\n"));
  };

  const goLoadData = async () => {
    if (!window.confirm("데이터 등록을 실행합니다.")) {
      return;
    }

    const targetCellValues = targetColumnRef.current.getCellValues(1);
    await loadExcelData({
      path: uploadedPath,
      startRow,
      startCol,
      queryParams,
      target: { ...targetData, columns: targetCellValues },
    });
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 overflow-hidden">
        <Splitter className="h-100">
          <SplitterPanel size={50} className="overflow-hidden p-1">
            <div className="w-100 h-100 d-flex flex-column">
              <div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">Row</span>
                  <InputNumber
                    placeholder="row"
                    value={startRow}
                    onChange={(e) => setStartRow(e.value)}
                    min={0}
                  />
                  <span className="p-inputgroup-addon">Col</span>
                  <InputNumber
                    placeholder="row"
                    value={startCol}
                    onChange={(e) => setStartCol(e.value)}
                    min={0}
                  />
                  <FileUpload
                    mode="basic"
                    chooseOptions={{
                      label: "Upload",
                      icon: "pi pi-file-excel",
                      iconOnly: true,
                    }}
                    name="file"
                    url="/api/dataloader/excel-file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    auto
                    customUpload
                    uploadHandler={async ({ files, options }) => {
                      const file = files[0];
                      console.log(options.props.url);
                      const uploadResult = await uploadFile({
                        file,
                        uploadUrl: options.props.url,
                      });
                      setUploadedPath(uploadResult.path);

                      options.clear();
                    }}
                  />
                </div>
              </div>
              <div className="mt-1 flex-grow-1 overflow-auto">
                <TableView header={[]} data={excelData} />
              </div>
              <div style={{ height: "250px" }}>
                <textarea
                  className="form-control w-100 h-100"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                ></textarea>
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel size={50} className="overflow-hidden p-1">
            <ConnectionStoreProvider name="sqlExcelLoader">
              <Splitter layout="vertical">
                <SplitterPanel className="overflow-hidden d-flex flex-column">
                  <div className="mb-1">
                    <ConnectionForm
                      onChange={(connInfo: ConnInfo) =>
                        setTargetData({ ...targetData, name: connInfo.name })
                      }
                    />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <TablesView
                      name="sqlExcelLoader.tableView"
                      onClick={({ item }: any) =>
                        setTargetData({
                          ...targetData,
                          owner: item.owner,
                          tableName: item.tableName,
                        })
                      }
                    />
                  </div>
                </SplitterPanel>
                <SplitterPanel className="overflow-hidden">
                  <EditableTableColumns
                    ref={targetColumnRef}
                    filter={{ owner: targetData.owner, tableName: targetData.tableName }}
                    editable={false}
                  />
                </SplitterPanel>
              </Splitter>
            </ConnectionStoreProvider>
          </SplitterPanel>
        </Splitter>
      </div>
      <div className="text-end">
        <Button
          label="실행"
          onClick={(e) => {
            goLoadData();
          }}
        />
      </div>
    </div>
  );
};

export default ExcelLoader;
