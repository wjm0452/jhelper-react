import React, { RefObject, useEffect, useState } from "react";
import httpClient from "../../common/httpClient";
import Pager from "../pager";

async function readAll(page: number, size: number) {
  const res = await httpClient.get("/api/memo", {
    params: {
      page,
      size,
    },
  });
  return res.data;
}

async function readData(id: string) {
  const res = await httpClient.get(`/api/memo/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
}

async function createData(obj: { title: string; content: string }) {
  const res = await httpClient.post("/api/memo", obj);
  return res.data;
}

async function updateData(obj: { id: string; title: string; content: string }) {
  const res = await httpClient.put("/api/memo", obj);
  return res.data;
}

async function deleteData(id: string) {
  const res = await httpClient.delete(`/api/memo/${id}`);
  const data = res.data;

  return data;
}

const RenderList = (props: any) => {
  const items = props.items;
  const clickHandler = props.clickHandler || function () {};

  return (
    <div>
      <ul>
        {items.map((item: any, i: number) => (
          <li
            style={{ textOverflow: "ellipsis" }}
            key={item.id}
            onClick={() => clickHandler(item)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const RenderMemos = (props: any) => {
  const [items, setItems] = useState([]);
  const [itemsFilter, setItemsFilter] = useState("");

  const updateHandler = props.updateHandler || function () {};

  useEffect(() => {
    let items = props.items;

    if (itemsFilter) {
      items = items.filter(
        (item: any) =>
          item.title.indexOf(itemsFilter) > -1 ||
          item.content.indexOf(itemsFilter) > -1
      );
    }

    setItems(items);
  }, [props.items, itemsFilter]);

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
      {items.map((item: any, i: number) => (
        <div key={item.id} className="p-3 border-bottom border-dark">
          <div className="shadow p-3 mb-5 bg-white rounded">
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
                  style={{ height: "120px" }}
                  value={item.content}
                  onChange={(e) => {
                    items[i].content = e.target.value;
                    setItems([...items]);
                  }}
                ></textarea>
              </div>
              <div className="d-flex flex-row justify-content-end">
                <button
                  className="btn btn-primary btn-sm me-1"
                  onClick={() => {
                    updateData(item).then((data) => {
                      updateHandler({
                        item: data,
                      });
                    });
                  }}
                >
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary btn-sm me-1"
                  onClick={() => {
                    deleteData(item.id).then((data) => {
                      items.splice(i, 1);
                      setItems([...items]);
                      updateHandler({
                        item: data,
                      });
                    });
                  }}
                >
                  Delete
                </button>
              </div>
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

  const [pageSize, setPageSize] = useState(100);

  const [pagingData, setPagingData] = useState({
    page: 0,
    totalPages: 0,
    items: [],
  });

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    readAll(0, pageSize).then((data) => {
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
      <div className="container">
        <h5>Memo</h5>
        <div className="d-flex flex-columns">
          <div className="pt-5" style={{ width: "300px" }}>
            <div className="m-5" style={{ overflow: "hidden" }}>
              <RenderList
                items={pagingData.items}
                clickHandler={(item: any) => {
                  console.log(item);
                }}
              />
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="p-3 border-bottom border-dark">
              <div className="text-end mb-1">
                <button
                  className="btn btn-sm me-1"
                  onClick={(e) => {
                    setExpand(!expand);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-slash-minus"
                    viewBox="0 0 16 16"
                  >
                    <path d="m1.854 14.854 13-13a.5.5 0 0 0-.708-.708l-13 13a.5.5 0 0 0 .708.708ZM4 1a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 4 1Zm5 11a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 9 12Z" />
                  </svg>
                </button>
              </div>
              <div
                className="shadow p-3 mb-5 bg-white rounded"
                style={{ display: expand ? "" : "none" }}
              >
                <div className="row g-3">
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
                      style={{ height: "120px" }}
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
                          readAll(0, pageSize).then((data) => {
                            setPagingData({
                              page: data.number,
                              totalPages: data.totalPages,
                              items: data.items,
                            });
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
            </div>
            <div className="mt-5">
              {
                <RenderMemos
                  items={pagingData.items}
                  updateHandler={() => {
                    console.log("updated!!");
                  }}
                ></RenderMemos>
              }
            </div>
            <div className="mt-5">
              <Pager
                page={pagingData.page}
                totalPages={pagingData.totalPages}
                onChange={(page: number) => {
                  readAll(page, pageSize).then((data) => {
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
      </div>
    </div>
  );
};

export default Memo;
