import { useEffect, useState } from "react";
import axios from "axios";
import Details from "./details";

async function readAll() {
  const res = await axios.get("/api/qna");
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
  const [items, setItems] = useState([]);
  const [qnaId, setQnaId] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    readAll().then((data) => {
      setItems(data);
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

              readAll().then((data) => {
                setItems(data);
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
          {renderQuestions(items, (id: any) => {
            setShowDetails(true);
            setQnaId(id);
          })}
        </div>
      </div>
    </div>
  );
};

export default QnA;
