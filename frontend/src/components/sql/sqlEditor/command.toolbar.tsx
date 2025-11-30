import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import EditorHistory from "./editor.history";

type FetchFormProps = {
  onCommand: (command: string, data?: any) => void;
};

const CommandToolbar = ({ onCommand }: FetchFormProps) => {
  const [fetchSize, setFetchSize] = useState(100);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <div className="d-flex">
        <div className="p-inputgroup md:w-30rem">
          <span className="p-inputgroup-addon">FetchSize</span>
          <InputNumber
            min={0}
            max={5000}
            value={fetchSize}
            onValueChange={(e) => {
              setFetchSize(e.value || 1);
              onCommand("fetchSize", e.value || 1);
            }}
          />
          <Button
            icon="pi pi-times"
            rounded
            onClick={() => {
              setFetchSize(100);
              onCommand("fetchSize", 100);
            }}
          />
        </div>
        <div>
          <Button
            icon="pi pi-play"
            rounded
            text
            aria-label="Run"
            label="Run"
            style={{ fontSize: "1rem" }}
            onClick={async () => onCommand("executeQuery")}
          />
          <Button
            icon="pi pi-eraser"
            rounded
            text
            aria-label="Clear"
            label="Clear"
            style={{ fontSize: "1rem" }}
            onClick={async () => onCommand("clear")}
          />
          <Button
            icon="pi pi-file-excel"
            rounded
            text
            aria-label="Excel"
            label="Excel"
            style={{ fontSize: "1rem" }}
            onClick={(e) => onCommand("exportExcel")}
          />
          <Button
            icon="pi pi-file-export"
            rounded
            text
            aria-label="Text"
            label="Text"
            style={{ fontSize: "1rem" }}
            onClick={(e) => onCommand("exportText")}
          />
          <Button
            icon="pi pi-file-export"
            rounded
            text
            aria-label="Json"
            label="Json"
            style={{ fontSize: "1rem" }}
            onClick={(e) => onCommand("exportJson")}
          />
          <Button
            icon="pi pi-file-export"
            rounded
            text
            aria-label="CSV"
            label="CSV"
            style={{ fontSize: "1rem" }}
            onClick={(e) => onCommand("exportCsv")}
          />
        </div>
        <div>
          <Button
            icon="pi pi-history"
            rounded
            text
            aria-label="History"
            label="History"
            style={{ fontSize: "1rem" }}
            onClick={() => setShowHistory(true)}
          />
        </div>
      </div>
      <Sidebar visible={showHistory} position="right" onHide={() => setShowHistory(false)} modal={false}>
        <EditorHistory
          onClick={(item) => {
            onCommand("addQuery", item.query);
          }}
        />
      </Sidebar>
    </>
  );
};

export default CommandToolbar;
