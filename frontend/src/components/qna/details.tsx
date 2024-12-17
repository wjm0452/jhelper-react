import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQna, saveQna } from "./qna.ts";

function Write(props: any) {
  const navigate = useNavigate();
  const login = useSelector((state: any) => state.login);
  const loginUser = login.data;
  const { qnaId } = useParams();
  const [item, setItem] = useState({
    id: "",
    title: "",
    content: "",
    registerId: loginUser.username,
    registerDate: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (qnaId) {
      getQna(qnaId).then((data) => {
        setItem(data);
      });
    }

    return () => {
      // unmount
    };
  }, []);

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="container">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Register Id</label>
            <input
              type="text"
              className="form-control"
              value={item.registerId}
              readOnly={true}
            ></input>
          </div>
          <div className="col-md-6">
            <label className="form-label">Register Date</label>
            <input
              type="datetime-local"
              className="form-control"
              value={item.registerDate}
              readOnly={true}
            ></input>
          </div>
          <div className="col-12">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={item.title}
              onChange={(e) => {
                setItem({
                  ...item,
                  title: e.target.value,
                });
              }}
              readOnly={item.registerId != loginUser.username}
            ></input>
          </div>
          <div className="col-12">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              style={{ height: "250px" }}
              value={item.content}
              onChange={(e) => {
                setItem({
                  ...item,
                  content: e.target.value,
                });
              }}
              readOnly={item.registerId != loginUser.username}
            ></textarea>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                saveQna(item);
              }}
            >
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Write;
