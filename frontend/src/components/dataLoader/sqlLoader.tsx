import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useRef } from "react";
import { loadData } from "./sqlLoader.api";
import SqlLoaderSourceForm from "./sqlLoader.sourceForm";
import SqlLoaderTargetForm from "./sqlLoader.targetForm";
import { useSqlLoaderSourceStore } from "./sqlLoader.store";
import { useMessageStoreInContext } from "../common/message/message.context";

const SqlLoader = () => {
  const sourceData = useSqlLoaderSourceStore();
  const targetData = useSqlLoaderSourceStore();
  const messageStore = useMessageStoreInContext();
  const targetRef = useRef<any>();

  const goLoadData = async () => {
    if (!window.confirm("데이터 등록을 실행합니다.")) {
      return;
    }
    const targetCellValues = targetRef.current.getCellValues(1);
    try {
      await loadData({
        query: sourceData.query,
        source: { ...sourceData },
        target: { ...targetData, columns: targetCellValues },
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
            <SqlLoaderSourceForm />
          </SplitterPanel>
          <SplitterPanel size={50} className="overflow-hidden p-1">
            <SqlLoaderTargetForm ref={targetRef} />
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

export default SqlLoader;
