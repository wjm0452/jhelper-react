import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { readExcel } from "./excelLoader.api";
import { uploadFile } from "../common/uploader/uploader.api";
import TableView from "../common/tableViewer";
import { useExcelLoaderSourceStore } from "./excelLoader.store";
import { InputTextarea } from "primereact/inputtextarea";

const ExcellLoaderSourceForm = () => {
  const sourceStore = useExcelLoaderSourceStore();
  const [excelData, setExcelData] = useState([]);

  const setQueryParams = (excelData: string[]) => {
    let queryParams = [];
    const startRow = sourceStore.startRow;
    const startCol = sourceStore.startCol;
    if (excelData.length && startRow != null && startCol != null) {
      const paramLength = excelData[startRow].length - startCol;
      if (paramLength > 0) {
        queryParams = new Array(paramLength);
        queryParams.fill("?");
      }
    }

    sourceStore.setQueryParams(queryParams.join(",\r\n"));
  };

  useEffect(() => {
    if (sourceStore.filePath) {
      readExcel({ uploadedPath: sourceStore.filePath }).then((data) => {
        setExcelData(data.result);
        setQueryParams(data.result);
      });
    }
  }, [sourceStore.filePath]);

  useEffect(() => {
    setQueryParams(excelData);
  }, [sourceStore.startRow, sourceStore.startCol]);

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">Row</span>
          <InputNumber
            placeholder="row"
            value={sourceStore.startRow}
            onChange={(e) => sourceStore.setStartRow(e.value)}
            min={0}
          />
          <span className="p-inputgroup-addon">Col</span>
          <InputNumber
            placeholder="row"
            value={sourceStore.startCol}
            onChange={(e) => sourceStore.setStartCol(e.value)}
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
            url="/api/dataloader/excel/upload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            auto
            customUpload
            uploadHandler={async ({ files, options }) => {
              const file = files[0];
              const uploadResult = await uploadFile({
                file,
                uploadUrl: options.props.url,
              });
              sourceStore.setFilePath(uploadResult.path);

              options.clear();
            }}
          />
        </div>
      </div>
      <div className="mt-1 flex-grow-1 overflow-auto">
        <TableView header={[]} data={excelData} />
      </div>
      <div style={{ height: "250px" }}>
        <InputTextarea
          className="w-100 h-100"
          value={sourceStore.queryParams}
          onChange={(e) => sourceStore.setQueryParams(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExcellLoaderSourceForm;
