import { useEffect, useState } from "react";
import Pager from "../pager/index.tsx";
import { useMemoStore } from "./memo.store.ts";
import { useDeleteMemo, useGetMemoList, useSaveMemo } from "./memo.query.ts";
import JButton from "../common/buttons/index.tsx";

const SideList = (props: any) => {
  const items = props.items;
  const clickHandler = props.clickHandler || function () {};

  if (!items) {
    return <div>loading...</div>;
  }

  return (
    <div className="shadow p-3 mb-5 bg-body rounded">
      <ul>
        <li
          className="text-primary"
          style={{ textOverflow: "ellipsis" }}
          onClick={() => clickHandler(null)}
        >
          <b>상위로</b>
        </li>
        {items.map((item: any, i: number) => (
          <li style={{ textOverflow: "ellipsis" }} key={item.id} onClick={() => clickHandler(item)}>
            {item.content.replace(/\n/g, " ").substring(0, 15)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MemoNote = ({ item: memo }: { item: Memo }) => {
  const { mutate: mutateSaveMemo } = useSaveMemo();
  const { mutate: mutateDeleteMemo } = useDeleteMemo();

  const [item, setItem] = useState<Memo>(memo);

  useEffect(() => {
    setItem(memo);
  }, [memo]);

  return (
    <div className="shadow p-3 bg-white rounded">
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
          <button className="btn btn-primary btn-sm me-1" onClick={() => mutateSaveMemo(item)}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary btn-sm me-1"
            onClick={() => mutateDeleteMemo(item.id)}
          >
            Delete
          </button>
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

    return itemsFilter
      ? items.filter((item: Memo) => item.content.indexOf(itemsFilter) > -1)
      : items;
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
          <MemoNote item={item} />
        </div>
      ))}
    </div>
  );
};

const Memo = () => {
  const memoStore = useMemoStore();
  const { data: memoResults } = useGetMemoList(memoStore);
  const { mutateAsync: mutateSaveMemo } = useSaveMemo();

  const [newMemo, setNewMemo] = useState<Memo>({
    content: "",
  });

  const [expand, setExpand] = useState(false);

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-0 p-3 border-bottom border-dark">
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
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await mutateSaveMemo(newMemo);
                  setNewMemo({ content: "" });
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 mt-5 overflow-y-scroll">
        {<MemoList items={memoResults?.items} />}
      </div>
      <div className="flex-grow-0 mt-5">
        <Pager
          page={memoStore.page}
          totalPages={memoResults?.totalPages}
          onChange={(page: number) => memoStore.put("page", page)}
        />
      </div>
    </div>
  );
};

export default Memo;
