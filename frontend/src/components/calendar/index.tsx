import React, { RefObject, useEffect, useState } from "react";
import "./index.css";
import httpClient from "../../common/httpClient";
import DaySelelctor from "./daySelector";

function getLastDay(month: number) {
  let d = new Date();
  d.setMonth(month);
  d.setDate(0);

  return d.getDate();
}

function toKorDay(day: number) {
  const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];
  return DAY_KO[day];
}

async function createData(obj: {
  fromDate: string;
  toDate: string;
  title: string;
  content: string;
}) {
  const res = await httpClient.post("/api/schedule", obj);
  return res.data;
}

async function readAll(year: number, month: number) {
  const res = await httpClient.get("/api/schedule", {
    params: {
      year,
      month,
    },
  });
  return res.data;
}

async function readData(id: string) {
  const res = await httpClient.get(`/api/schedule/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
}
async function updateData(obj: {
  id: string;
  fromDate?: string;
  toDate?: string;
  title?: string;
  content?: string;
}) {
  const res = await httpClient.put("/api/schedule", obj);
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
      fromDate: item.fromDate,
      toDate: item.toDate,
      title: item.title,
      content: item.content,
    });
  } else {
    item.registerDate = new Date();
    return createData({
      fromDate: item.fromDate,
      toDate: item.toDate,
      title: item.title,
      content: item.content,
    });
  }
}

async function deleteData(id: string) {
  const res = await httpClient.delete(`/api/schedule/${id}`);
  const data = res.data;

  return data;
}

export default class Scheduler extends React.Component<any, any> {
  colors;

  constructor(props: any) {
    super(props);

    let now = new Date();

    this.state = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      days: [],
      schedules: [],
      regist: {
        id: "",
        fromDate: "",
        toDate: "",
        title: "",
        content: "",
      },
    };

    this.colors = [
      "blue",
      "indigo",
      "purple",
      "pink",
      "orange",
      "yellow",
      "green",
      "teal",
      "cyan",
    ];
  }

  componentDidMount() {
    const state = this.state;
    this.setDate(state.year, state.month, state.day);
  }

  dayToDateString(day: number) {
    let year = String(this.state.year).padStart(2, "0");
    let month = String(this.state.month).padStart(2, "0");
    let dayString = String(day).padStart(2, "0");

    return `${year}-${month}-${dayString}`;
  }

  getDayInfo(year: number, month: number) {
    let d = new Date(year, month, 1);
    let lastDate = getLastDay(month);
    let days = [];
    for (let i = 1; i <= lastDate; i++) {
      d.setDate(i);
      days.push({
        day: i,
        weekday: d.getDay(),
      });
    }

    return days;
  }

  async setDate(year: number, month: number, day: number) {
    let schedules = await readAll(year, month);

    this.setState({
      year: year,
      month: month,
      day: day,
      days: this.getDayInfo(year, month),
      schedules: schedules,
    });
  }

  setSelectedDate(start: number, end: number) {
    let fromDate = this.dayToDateString(Math.min(start, end));
    let toDate = this.dayToDateString(Math.max(start, end));

    this.setState({
      regist: {
        ...this.state.regist,
        fromDate,
        toDate,
      },
    });
  }

  updateSchedule(item: {
    id: string;
    fromDate: string;
    toDate: string;
    title?: string;
    content?: string;
  }) {
    updateData(item);
  }

  RenderSchedule() {
    const state = this.state;
    const days = state.days;
    const schedules = state.schedules;

    return (
      <div>
        <DaySelelctor
          days={days}
          title=""
          onSelectHandler={(start: number, end: number) => {
            this.setSelectedDate(start, end);
          }}
        ></DaySelelctor>
        {schedules.map((sch: any, idx: number) => {
          let color = this.colors[idx % this.colors.length];

          return (
            <DaySelelctor
              key={sch.id}
              days={days}
              title={sch.title}
              start={sch.fromDate.substring(8)}
              end={sch.toDate.substring(8)}
              color={color}
              onTitleClickHandler={async () => {
                let selectSch = await readData(sch.id);

                this.setState({
                  regist: selectSch,
                });
              }}
              onSelectHandler={(start: number, end: number) => {
                let fromDate = this.dayToDateString(Math.min(start, end));
                let toDate = this.dayToDateString(Math.max(start, end));

                this.updateSchedule({
                  id: sch.id,
                  fromDate,
                  toDate,
                });
              }}
            ></DaySelelctor>
          );
        })}
      </div>
    );
  }

  RenderCalendar() {
    const state = this.state;
    let dd: any[] = state.days;

    return (
      <div className="">
        <div className="text-nowrap">
          <div
            className="d-inline-block text-center day-head"
            style={{ width: "160px" }}
          >
            <div>#</div>
            <div>Title</div>
          </div>
          {dd.map((d) => {
            let dayColor = "black";
            if (d.weekday == 0) {
              dayColor = "red";
            } else if (d.weekday == 6) {
              dayColor = "blue";
            }

            return (
              <div
                key={d.day}
                className="d-inline-block text-center day-head"
                style={{ width: "20px", color: dayColor }}
              >
                <div>{toKorDay(d.weekday)}</div>
                <div>{d.day}</div>
              </div>
            );
          })}
        </div>
        {this.RenderSchedule()}
      </div>
    );
  }

  render() {
    const state = this.state;
    return (
      <div className="w-100 h-100 d-flex flex-row">
        <div
          className="flex-grow-0 flex-shrink-0"
          style={{ flexBasis: "320px" }}
        >
          <div className="p-3">
            <div className="shadow p-3 mb-5 bg-white rounded">
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={this.state.regist.fromDate}
                    onChange={(e) => {
                      let regist = this.state.regist;
                      regist.fromDate = e.currentTarget.value;

                      this.setState({ regist });
                    }}
                  ></input>
                </div>
                <div className="col-6">
                  <label className="form-label">&nbsp;</label>
                  <input
                    type="date"
                    className="form-control"
                    value={this.state.regist.toDate}
                    onChange={(e) => {
                      let regist = this.state.regist;
                      regist.toDate = e.currentTarget.value;

                      this.setState({ regist });
                    }}
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.regist.title}
                    onChange={(e) => {
                      let regist = this.state.regist;
                      regist.title = e.currentTarget.value;

                      this.setState({ regist });
                    }}
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    style={{ height: "120px" }}
                    value={this.state.regist.content}
                    onChange={(e) => {
                      let regist = this.state.regist;
                      regist.content = e.currentTarget.value;

                      this.setState({ regist });
                    }}
                  ></textarea>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={async () => {
                      await saveData(this.state.regist);

                      this.setDate(state.year, state.month, 1);
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={async () => {
                      await deleteData(this.state.regist.id);

                      this.setDate(state.year, state.month, 1);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow-1 flex-shrink-1">
          <div>
            <button
              className="btn btn-secondary btn-sm me-1"
              onClick={() => {
                let year = state.year;
                let month = state.month;
                month--;

                if (month == 0) {
                  month = 12;
                  year--;
                }

                this.setDate(year, month, 1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
            </button>
            <div
              className="d-inline-block text-center"
              style={{ width: "120px" }}
            >
              {state.year}년 {state.month}월
            </div>
            <button
              className="btn btn-secondary btn-sm me-1"
              onClick={() => {
                let year = state.year;
                let month = state.month;
                month++;

                if (month == 13) {
                  month = 1;
                  year++;
                }

                this.setDate(year, month, 1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-auto">{this.RenderCalendar()}</div>
        </div>
      </div>
    );
  }
}
