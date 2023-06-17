import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

async function readData(id: string) {
  const res = await axios.get(`/api/qna/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
}

async function createData(obj: { title: string; content: string }) {
  const res = await axios.post("/api/qna", obj);
  return res.data;
}

async function updateData(obj: { id: string; title: string; content: string }) {
  const res = await axios.put("/api/qna", obj);
  return res.data;
}

function saveData(data: any) {
  const item = data;
  if (!item.title.trim() || !item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateData({
      id: item.id,
      title: item.title,
      content: item.content,
    });
  } else {
    item.registerDate = new Date();
    return createData({
      title: item.title,
      content: item.content,
    });
  }
}

function fetchData(id: string) {
  return readData(id);
}

function Details(props: any) {
  const login = useSelector((state: any) => state.login);
  const loginUser = login.data;

  const [item, setItem] = useState({
    id: "",
    title: "",
    content: "",
    registerId: loginUser.email,
    registerDate: new Date().toISOString().slice(0, 16),
  });

  const onCloseHandler = props.onCloseHandler;
  const onSaveHandler = props.onSaveHandler || function () {};

  useEffect(() => {
    if (props.qnaId) {
      fetchData(props.qnaId).then((data) => {
        setItem(data);
      });
    } else {
      setItem({
        id: "",
        title: "",
        content: "",
        registerId: loginUser.email,
        registerDate: new Date().toISOString().slice(0, 16),
      });
    }
    return () => {};
  }, [props.qnaId]);

  return (
    <div
      className="modal"
      style={{
        display: "block",
      }}
      tabIndex={-1}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Q & A</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onCloseHandler(item)}
            ></button>
          </div>
          <div className="modal-body">
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
                ></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onCloseHandler();
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                saveData(item).then(() => {
                  onSaveHandler(item);
                });
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
