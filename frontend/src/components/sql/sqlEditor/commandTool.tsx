import { useState } from "react";

type FetchFormProps = {
  onCommand: (command: string, data?: any) => void;
};

const CommandTool = ({ onCommand }: FetchFormProps) => {
  const [fetchSize, setFetchSize] = useState(100);

  return (
    <>
      <div className="row g-1">
        <div className="col-auto input-group">
          <span className="input-group-text">Fetch Size</span>
          <input
            type="number"
            className="form-control"
            min={0}
            value={fetchSize}
            onChange={(e) => {
              setFetchSize(e.target.valueAsNumber || 1);
              onCommand("fetchSize", e.target.valueAsNumber || 1);
            }}
          />
          <button className="btn btn-secondary" onClick={() => onCommand("clear")}>
            clear
          </button>
          <button className="btn btn-primary" onClick={async () => onCommand("executeQuery")}>
            run
          </button>
        </div>
      </div>
      <div className="mt-1 text-end">
        <button className="btn btn-secondary btn-sm me-1" onClick={(e) => onCommand("exportExcel")}>
          excel
        </button>
        <button className="btn btn-secondary btn-sm me-1" onClick={(e) => onCommand("exportText")}>
          text
        </button>
        <button className="btn btn-secondary btn-sm me-1" onClick={(e) => onCommand("exportJson")}>
          json
        </button>
      </div>
    </>
  );
};

export default CommandTool;
