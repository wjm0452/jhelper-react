import { useGetMemoList } from "./memo.query";
import { useMemoStore } from "./memo.store";
import "./memo.sidebar.css";

const MemoSidebar = () => {
  const memoStore = useMemoStore();
  const { data: memoResults } = useGetMemoList(memoStore);
  const items = memoResults?.items;

  if (!items || items.length === 0) {
    return <div></div>;
  }

  return (
    <div className="shadow p-3 mb-5 bg-body rounded">
      <ul className="memo-sidebar-items">
        {items.map((item: any, i: number) => (
          <li
            className="cursor-pointer mb-2"
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

export default MemoSidebar;
