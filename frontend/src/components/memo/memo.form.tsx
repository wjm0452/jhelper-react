import { useState } from "react";
import JButton from "../common/buttons";
import { useSaveMemo } from "./memo.query";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

const MemoForm = () => {
  const [expand, setExpand] = useState(false);
  const { mutateAsync: mutateSaveMemo } = useSaveMemo();

  const [newMemo, setNewMemo] = useState<Memo>({
    content: "",
  });

  return (
    <>
      <div className="text-end mb-1">
        <JButton.plusMinus onClick={(e) => setExpand(!expand)} />
      </div>
      <div className="shadow p-3 mb-5 bg-white rounded" style={{ display: expand ? "" : "none" }}>
        <div className="row g-3">
          <div className="col-12">
            <InputTextarea
              className="w-100"
              style={{ height: "120px" }}
              placeholder="입력하세요..."
              value={newMemo.content}
              onChange={(e) => {
                setNewMemo({ content: e.target.value });
              }}
            />
          </div>
          <div className="d-flex flex-row justify-content-end">
            <Button
              label="저장"
              onClick={async () => {
                await mutateSaveMemo(newMemo);
                setNewMemo({ content: "" });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoForm;
