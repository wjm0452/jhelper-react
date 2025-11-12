import { useEffect, useState } from "react";
import Pager from "../pager/index.tsx";
import { useMemoStore } from "./memo.store.ts";
import { useDeleteMemo, useGetMemoList, useSaveMemo } from "./memo.query.ts";
import JButton from "../common/buttons/index.tsx";
import { Button } from "primereact/button";

type SideListProps = {
  items: Memo[];
};

const SideList = (props: SideListProps) => {
  const items = props.items;

  if (!items) {
    return <div>loading...</div>;
  }

  return (
    <div className="shadow p-3 mb-5 bg-body rounded">
      <ul>
        {items.map((item: any, i: number) => (
          <li
          className="cursor-pointer"
            style={{ textOverflow: "ellipsis" }}
            key={item.id}
            onClick={() => document.getElementById(item.id)?.scrollIntoView()}
          >
            {item.content.replace(/\n/g, " ").substring(0, 15)}
          </li>
        ))}
      </ul>
    </div>
  );
};

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
      <div className="row g-3">
        <div className="col-12">
          <input
            type="datetime-local"
            className="form-control"
            value={item.registerDate ? item.registerDate.substring(0, 16) : ""}
            readOnly={true}
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
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

const MemoList = ({ items: memoList }: { items: Memo[] }) => {
  const [itemsFilter, setItemsFilter] = useState("");
  const filteredItems = (items: Memo[]) => {
    if (!items) {
      return [];
    }

    return itemsFilter ? items.filter((item: Memo) => item.content.indexOf(itemsFilter) > -1) : items;
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Filter..."
          value={itemsFilter}
          onChange={(e) => {
            setItemsFilter(e.target.value);
          }}
        ></input>
      </div>
      {filteredItems(memoList).map((item: any, i: number) => (
        <div id={"memo_" + item.id} key={item.id} className="p-3">
          <MemoItem item={item} />
        </div>
      ))}
    </div>
  );
};

const MemoRegist = () => {
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
            <textarea
              className="form-control"
              style={{ height: "120px" }}
              placeholder="입력하세요..."
              value={newMemo.content}
              onChange={(e) => {
                setNewMemo({ content: e.target.value });
              }}
            ></textarea>
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

const Memo = () => {
  const memoStore = useMemoStore();
  const { data: memoResults } = useGetMemoList(memoStore);

  return (
    <>
      <div className="h-100 container-xxl">
        <div className="row h-100">
          <div className="col-4">
            <SideList items={memoResults?.items} />
          </div>
          <div className="h-100 d-flex flex-column col-8">
            <div className="flex-grow-0 p-3 border-bottom border-dark">
              <MemoRegist />
            </div>
            <div className="flex-grow-1 mt-5 overflow-y-scroll">
              <MemoList items={memoResults?.items} />
            </div>
            <div className="flex-grow-0 mt-5">
              <Pager
                page={memoStore.page}
                totalPages={memoResults?.totalPages}
                onChange={(page: number) => memoStore.put("page", page)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Memo;
