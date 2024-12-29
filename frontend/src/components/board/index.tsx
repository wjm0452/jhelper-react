import { useNavigate } from "react-router-dom";
import Pager from "../pager/index.tsx";
import { useGetBoardList } from "./query.ts";
import { useSearchBoardsStore } from "./store.ts";

const RenderQuestions = (items: any, clickHandler: Function) => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Register Id</th>
            <th scope="col">Register Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((q: any, i: number) => (
            <tr key={q.id}>
              <th scope="row">{i + 1}</th>
              <td
                onClick={() => {
                  clickHandler(q.id);
                }}
              >
                {q.title}
              </td>
              <td>{q.registerId}</td>
              <td>{q.registerDate ? q.registerDate.substring(0, 16) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Board = () => {
  const searchBoardStore = useSearchBoardsStore();

  const {
    isPending,
    isFetching,
    data: { items, totalPages } = {},
  } = useGetBoardList({
    page: searchBoardStore.page,
    pageSize: searchBoardStore.pageSize,
  });

  const navigate = useNavigate();
  const goToDetails = (boardId: any = "") => {
    navigate(`/board/details/${boardId}`);
  };

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="p-5">
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              goToDetails("");
            }}
          >
            등록
          </button>
        </div>
        <div>
          {isPending || isFetching ? (
            <div>loading...</div>
          ) : (
            RenderQuestions(items, (id: any) => {
              goToDetails(id);
            })
          )}
        </div>
        <div>
          <Pager
            page={searchBoardStore.page}
            totalPages={totalPages}
            onChange={async (page: number) => {
              searchBoardStore.put("page", page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;
