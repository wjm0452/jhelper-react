import { useMemoStore } from "./memo.store.ts";
import { useGetMemoList } from "./memo.query.ts";
import MemoSidebar from "./memo.sidebar.tsx";
import MemoForm from "./memo.form.tsx";
import MemoList from "./memo.list.tsx";
import { Paginator } from "primereact/paginator";

const Memo = () => {
  const memoStore = useMemoStore();
  const { data: memoResults } = useGetMemoList(memoStore);

  const onPageChange = (event: { first: number; rows: number }) => {
    memoStore.setPage(event.first / event.rows);
    memoStore.setSize(event.rows);
  };

  return (
    <>
      <div className="h-100 container-xxl">
        <div className="row h-100">
          <div className="col-2">
            <MemoSidebar />
          </div>
          <div className="h-100 d-flex flex-column col-8">
            <div className="flex-grow-0 p-3 border-bottom border-dark">
              <MemoForm />
            </div>
            <div className="flex-grow-1 mt-5 overflow-y-scroll">
              <MemoList />
            </div>
            <div className="flex-grow-0 mt-5">
              <Paginator
                first={memoStore.page * memoStore.size}
                rows={memoStore.size}
                totalRecords={memoResults?.totalElements}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Memo;
