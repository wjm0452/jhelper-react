import React from "react";
import axios from "axios";

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

export default class QnaDetails extends React.Component<any, any> {
  private id: string;

  private saveHandler: Function;

  constructor(props: any) {
    super(props);

    this.saveHandler = props.onSave;

    this.state = {
      data: {
        id: "",
        title: "",
        content: "",
        registerId: "",
        registerDate: "",
      },
      visible: false,
    };

    this.id = "";
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  toggle() {
    this.setState({ visible: !this.state.visible });
  }

  open(id: string) {
    if (!id) {
      this.clearData();
      this.show();
      return;
    }

    this.fetchData(id).then(() => {
      this.show();
    });
  }

  fetchData(id: string) {
    if (id == this.id) {
      return Promise.resolve();
    }

    return readData(id).then((data) => {
      this.id = data.id;
      this.setState({ data: data });
    });
  }

  saveData() {
    const item = this.state.data;

    if (!item.title.trim() || !item.content.trim()) {
      return;
    }

    if (item.id) {
      updateData({
        id: item.id,
        title: item.title,
        content: item.content,
      }).then(() => {
        if (this.saveHandler) {
          this.saveHandler();
        }
      });
    } else {
      item.registerDate = new Date();
      createData({
        title: item.title,
        content: item.content,
      }).then(() => {
        if (this.saveHandler) {
          this.saveHandler();
        }
      });
    }
  }

  clearData() {
    this.id = "";
    this.setState({
      data: {
        id: "",
        title: "",
        content: "",
        registerId: "",
        registerDate: "",
      },
    });
  }

  render() {
    const data = this.state.data;

    return (
      <div
        className="modal"
        style={{
          display: this.state.visible !== false ? "block" : "none",
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
                onClick={() => this.setState({ visible: false })}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Register Id</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.registerId || ''}
                    onChange={(e) => {
                      data.registerId = e.target.value;
                      this.setState({ data });
                    }}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Register Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={data.registerDate || ''}
                    onChange={(e) => {
                      data.registerDate = e.target.value;
                      this.setState({ data });
                    }}
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.title || ''}
                    onChange={(e) => {
                      data.title = e.target.value;
                      this.setState({ data });
                    }}
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    style={{ height: "250px" }}
                    value={data.content || ''}
                    onChange={(e) => {
                      data.content = e.target.value;
                      this.setState({ data });
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.setState({ visible: false })}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.saveData()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
