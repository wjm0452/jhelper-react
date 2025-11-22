import { useEffect, useState } from "react";
import { useDeleteMemo, useSaveMemo } from "./memo.query";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

type MemoItemProps = {
  item: Memo;
};

const MemoItem = (props: MemoItemProps) => {
  const { mutate: mutateSaveMemo } = useSaveMemo();
  const { mutate: mutateDeleteMemo } = useDeleteMemo();

  const [item, setItem] = useState<Memo>(props.item);

  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  return (
    <div id={"" + item.id} className="shadow p-3 bg-white rounded">
      <div className="row">
        <div className="col-12">
          <span>{item.registerDate ? new Date(item.registerDate).toLocaleString() : ""}</span>
        </div>
        <div className="col-12">
          <InputTextarea
            className="w-100"
            style={{ height: "120px" }}
            value={item.content}
            onChange={(e) => {
              setItem({ ...item, content: e.currentTarget.value });
            }}
          />
        </div>
        <div className="d-flex flex-row justify-content-end">
          <Button
            label="저장"
            onClick={async () => {
              mutateSaveMemo(item);
            }}
          />
          <Button
            label="삭제"
            severity="secondary"
            onClick={async () => {
              mutateDeleteMemo(item.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MemoItem;
