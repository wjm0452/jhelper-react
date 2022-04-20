import React, { RefObject } from "react";
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

export default class Memo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      title: "",
      content: "",
      filter: "",
      data: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    readAll().then((data) => {
      this.setState({ data });
    });
  }

  createData() {
    var data = {
      title: this.state.title,
      content: this.state.content,
      registerId: "wjm",
    };

    if (!data.title.trim() || !data.content.trim()) { return; }

    createData(data).then((data) => {
      this.setState({ title: "", content: "", data: [data, ...this.state.data] });
    });
  }

  updateData(data: any) {
    updateData(data);
  }

  renderData() {
    let filter: string = this.state.filter;
    let data: any[] = this.state.data;

    if (filter) {
      data = data.filter(
        (item: any) =>
          item.title.indexOf(filter) > -1 || item.content.indexOf(filter) > -1
      );
    }

    return data.map((item: any, i: number) => (
      <div key={item.id} className="p-3 border-bottom border-dark">
        <div className="row g-3">
          <div className="">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={item.title}
              onChange={(e) => {
                item.title = e.target.value;
                this.setState({ item });
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
                item.content = e.target.value;
                this.setState({ item });
              }}
            ></textarea>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => this.updateData(item)}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    ));
  }

  filter(text: string) {
    this.setState({ filter: text });
  }

  render() {
    return (
      <div className="container h-100 overflow-auto">
        <div>
          <h5>Memo</h5>
          <div>
            <input
              type="text"
              placeholder="Find..."
              onChange={(e) => this.filter(e.target.value)}
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
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.target.value })}
              ></input>
            </div>
            <div className="">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                style={{ height: "250px" }}
                value={this.state.content}
                onChange={(e) => this.setState({ content: e.target.value })}
              ></textarea>
            </div>
            <div className="d-flex flex-row justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => this.createData()}
              >
                New
              </button>
            </div>
          </div>
        </div>
        <div>{this.renderData()}</div>
      </div >
    );
  }
}
