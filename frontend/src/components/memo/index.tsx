import React, { RefObject, useEffect, useState } from "react";
import axios from "axios";

async function readAll() {
  const res = await axios.get("/api/memo");
  return res.data;
}

async function readData(id: string) {
  const res = await axios.get(`/api/memo/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
}

async function createData(obj: { title: string; content: string }) {
  const res = await axios.post("/api/memo", obj);
  return res.data;
}

async function updateData(obj: { id: string; title: string; content: string }) {
  const res = await axios.put("/api/memo", obj);
  return res.data;
}

const RenderMemos = (props: any) => {
  const [items, setItems] = useState([]);
  const updateHandler = props.updateHandler || function () {};

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  return (
    <div>
      {items.map((item: any, i: number) => (
        <div key={item.id} className="p-3 border-bottom border-dark">
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
                value={
                  item.registerDate ? item.registerDate.substring(0, 16) : ""
                }
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
                  items[i].title = e.target.value;
                  setItems([...items]);
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
                  items[i].content = e.target.value;
                  setItems([...items]);
                }}
              ></textarea>
            </div>
            <div className="d-flex flex-row justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  updateData(item).then((data) => {
                    updateHandler({
                      item: data,
                    });
                  });
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Memo = () => {
  const [item, setItem] = useState({
    title: "",
    content: "",
  });

  const [items, setItems] = useState([]);
  const [itemsFilter, setItemsFilter] = useState("");

  useEffect(() => {
    readAll().then((data) => {
      setItems(data);
    });

    return () => {};
  }, []);

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="container">
        <div>
          <h5>Memo</h5>
          <div>
            <input
              type="text"
              placeholder="Find..."
              value={itemsFilter}
              onChange={(e) => setItemsFilter(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="p-3 border-bottom border-dark">
          <div className="row g-3">
            <div className="">
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
            <div className="">
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
            <div className="d-flex flex-row justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  createData(item).then(() => {
                    readAll().then((data) => {
                      setItems(data);
                      setItem({
                        title: "",
                        content: "",
                      });
                    });
                  });
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
        <div>
          {
            <RenderMemos
              items={items.filter(
                (item: any) =>
                  item.title.indexOf(itemsFilter) > -1 ||
                  item.content.indexOf(itemsFilter) > -1
              )}
              updateHandler={() => {
                console.log("updated!!");
              }}
            ></RenderMemos>
          }
        </div>
      </div>
    </div>
  );
};

export default Memo;
