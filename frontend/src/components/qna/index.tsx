import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pager from "../pager";
import { getQnaList } from "./qna.ts";

function renderQuestions(items: any, clickHandler: Function) {
  return (
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
  );
}

const QnA = () => {
  const PAGE_SIZE = 10;

  const [pagingData, setPagingData] = useState({
    page: 0,
    totalPages: 0,
    items: [],
  });

  useEffect(() => {
    getQnaList(0, PAGE_SIZE).then((data) => {
      setPagingData({
        page: data.number,
        totalPages: data.totalPages,
        items: data.items,
      });
    });

    return () => {};
  }, []);

  const navigate = useNavigate();
  const goToDetails = (qnaId: any = "") => {
    navigate(`/qna/details/${qnaId}`);
  };

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="p-5">
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // setShowDetails(true);
              // setQnaId("");
              goToDetails("");
            }}
          >
            등록
          </button>
        </div>
        <div>
          {renderQuestions(pagingData.items, (id: any) => {
            goToDetails(id);
          })}
        </div>
        <div>
          <Pager
            page={pagingData.page}
            totalPages={pagingData.totalPages}
            onChange={(page: number) => {
              getQnaList(page, PAGE_SIZE).then((data) => {
                setPagingData({
                  page: data.number,
                  totalPages: data.totalPages,
                  items: data.items,
                });
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QnA;
