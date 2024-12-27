import { useEffect, useState } from "react";
import Pager from "../pager";
import { getMemoList, createMemo, updateMemo, deleteMemo } from "./memo.ts";

const RenderSideList = (props: any) => {
  const items = props.items;
  const clickHandler = props.clickHandler || function () {};

  return (
    <div className="shadow p-3 mb-5 bg-body rounded">
      <ul>
        <li
          className="text-primary"
          style={{ textOverflow: "ellipsis" }}
          onClick={() => clickHandler(null)}
        >
          <b>상위로</b>
        </li>
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
        <div
          id={"memo_" + item.id}
          key={item.id}
          className="p-3 border-bottom border-dark"
        >
          <div className="shadow p-3 bg-white rounded">
            <div className="row g-3">
              <div className="col-12">
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
                    updateMemo(item).then((data) => {
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
                    deleteMemo(item.id).then((data) => {
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
    content: "",
  });

  const [pageSize, setPageSize] = useState(3);

  const [pagingData, setPagingData] = useState({
    page: 0,
    totalPages: 0,
    items: [],
  });

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    getMemoList(0, pageSize).then((data) => {
      setPagingData({
        page: data.number,
        totalPages: data.totalPages,
        items: data.items,
      });
    });

    return () => {};
  }, []);

  return (
    <div className="grid">
      <div className="g-col" style={{ width: "300px" }}>
        <div
          className="position-sticky"
          style={{ top: "3rem", height: "calc(100vh - 5rem)" }}
        >
          <div className="p-5">
            <RenderSideList
              items={pagingData.items}
              clickHandler={(item: any) => {
                if (item) {
                  var elem: any = document.querySelector(`#memo_${item.id}`);
                  document.querySelectorAll("html")[0].scrollTop =
                    elem.offsetTop;
                } else {
                  document.querySelectorAll("html")[0].scrollTop = 0;
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="g-col-6">
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
                    createMemo(item).then(() => {
                      getMemoList(0, pageSize).then((data) => {
                        setPagingData({
                          page: data.number,
                          totalPages: data.totalPages,
                          items: data.items,
                        });
                        setItem({
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
              getMemoList(page, pageSize).then((data) => {
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

export default Memo;
