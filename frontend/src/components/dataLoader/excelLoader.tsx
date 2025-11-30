import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useRef } from "react";
import { loadExcelData } from "./excelLoader.api";
import ExcellLoaderSourceForm from "./excelLoader.sourceForm";
import { useExcelLoaderSourceStore, useExcelLoaderTargetStore } from "./excelLoader.store";
import ExcelLoaderTargetForm from "./excelLoader.targetForm";
import { useMessageStoreInContext } from "../common/message/message.context";

const ExcelLoader = () => {
  const sourceStore = useExcelLoaderSourceStore();
  const targetStore = useExcelLoaderTargetStore();
  const messageStore = useMessageStoreInContext();
  const targetFormRef = useRef<any>();

  const goLoadData = async () => {
    if (!(await messageStore.confirm("데이터 등록을 실행합니다."))) {
      return;
    }

    const targetCellValues = targetFormRef.current.getCellValues(1);
    try {
      await loadExcelData({
        path: sourceStore.filePath,
        startRow: sourceStore.startRow,
        startCol: sourceStore.startCol,
        queryParams: sourceStore.queryParams,
        target: {
          connName: targetStore.connName,
          owner: targetStore.owner,
          tableName: targetStore.tableName,
          columns: targetCellValues,
        },
      });
      messageStore.toast("성공", "엑셀 데이터가 성공적으로 등록되었습니다.", { severity: "success" });
    } catch (e: any) {
      messageStore.toast("오류", "데이터 등록 중 오류가 발생했습니다\n" + `[${e.state}] ${e.detail}`, {
        severity: "error",
      });
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 overflow-hidden">
        <Splitter className="h-100">
          <SplitterPanel size={50} className="overflow-hidden p-1">
            <ExcellLoaderSourceForm />
          </SplitterPanel>
          <SplitterPanel size={50} className="overflow-hidden p-1">
            <ExcelLoaderTargetForm ref={targetFormRef} />
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
