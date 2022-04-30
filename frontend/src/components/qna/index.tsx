import React, { RefObject } from "react";
import axios from "axios";
import QnaDetails from "./details";

async function readAll() {
  const res = await axios.get("/api/qna");
  return res.data;
}

export default class Qna extends React.Component<any, any> {
  private detailsRef: RefObject<QnaDetails>;
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
    };

    this.detailsRef = React.createRef<QnaDetails>();
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    readAll().then((data) => {
      this.setState({ data: data });
    });
  }

  openDetails(id: string) {
    this.detailsRef.current?.open(id);
  }

  newQna() {
    this.openDetails("");
  }

  renderQuestions() {
    const data: any[] = this.state.data;
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">title</th>
            <th scope="col">register</th>
          </tr>
        </thead>
        <tbody>
          {data.map((q: any, i: number) => (
            <tr key={q.id}>
              <th scope="row">{i + 1}</th>
              <td onClick={() => this.openDetails(q.id)}>{q.title}</td>
              <td>{q.registerId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="w-100 h-100 p-2">
        <div>
          <QnaDetails ref={this.detailsRef}></QnaDetails>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.newQna()}
          >
            등록
          </button>
        </div>
        <div>{this.renderQuestions()}</div>
      </div>
    );
  }
}
