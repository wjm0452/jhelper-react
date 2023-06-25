import { useEffect, useState } from "react";
import httpClient from "../../common/httpClient";
import Details from "./details";
import Pager from "../pager";

async function readAll(page: number, size: number) {
  const res = await httpClient.get("/api/qna", {
    params: {
      page,
      size,
    },
  });

  return res.data;
}

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
  const [qnaId, setQnaId] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    readAll(0, PAGE_SIZE).then((data) => {
      setPagingData({
        page: data.number,
        totalPages: data.totalPages,
        items: data.items,
      });
    });

    return () => {};
  }, []);

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="p-5">
        <div style={{ display: showDetails ? "block" : "none" }}>
          <Details
            qnaId={qnaId}
            onCloseHandler={() => {
              setShowDetails(false);
            }}
            onSaveHandler={(item: any) => {
              console.log("saved", item);
              setShowDetails(false);

              readAll(0, PAGE_SIZE).then((data) => {
                setPagingData({
                  page: data.number,
                  totalPages: data.totalPages,
                  items: data.items,
                });
              });
            }}
          ></Details>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShowDetails(true);
              setQnaId("");
            }}
          >
            등록
          </button>
        </div>
        <div>
          {renderQuestions(pagingData.items, (id: any) => {
            setShowDetails(true);
            setQnaId(id);
          })}
        </div>
        <div>
          <Pager
            page={pagingData.page}
            totalPages={pagingData.totalPages}
            onChange={(page: number) => {
              readAll(page, PAGE_SIZE).then((data) => {
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
