import { useState } from "react";
import MemoItem from "./memo.item";
import { useMemoStore } from "./memo.store";
import { useGetMemoList } from "./memo.query";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const MemoList = () => {
  const memoStore = useMemoStore();
  const { data: memoResults } = useGetMemoList(memoStore);
  const items = memoResults?.items;

  const [itemsFilter, setItemsFilter] = useState("");

  const RenderMemoList = () => {
    if (!items || items.length === 0) {
      if (memoStore.filter === "") {
        return <div className="text-center font-italic p-3">등록된 메모가 없습니다.</div>;
      } else {
        return <div className="text-center font-italic p-3">조건에 맞는 메모가 없습니다.</div>;
      }
    }
    return items?.map((item: any, i: number) => (
      <div id={"memo_" + item.id} key={item.id} className="p-3">
        <MemoItem item={item} />
      </div>
    ));
  };

  return (
    <div>
      <div className="mt-2 justify-content-end d-flex mr-2">
        <div className="p-inputgroup md:w-20rem">
          <InputText
            className="p-inputtext-sm"
            placeholder="Filter..."
            value={itemsFilter}
            onChange={(e: any) => {
              setItemsFilter(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                memoStore.setFilter(e.target.value);
              }
            }}
          />
          <Button icon="pi pi-search" onClick={() => memoStore.setFilter(itemsFilter)} />
        </div>
      </div>
      {RenderMemoList()}
    </div>
  );
};
export default MemoList;
