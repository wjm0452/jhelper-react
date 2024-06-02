import React from "react";

export default class DaySelelctor extends React.Component<any, any> {
  start = -1;
  end = -1;
  clicked = false;
  dragging = false;

  onTitleClickHandler = function () {};
  onSelectHandler = function (start: number, end: number) {};

  constructor(props: any) {
    super(props);

    this.state = {
      start: props.start || -1,
      end: props.end || -1,
    };

    if (this.props.onSelectHandler) {
      this.onSelectHandler = this.props.onSelectHandler;
    }

    if (this.props.onTitleClickHandler) {
      this.onTitleClickHandler = this.props.onTitleClickHandler;
    }
  }

  setSelectDate(start: number, end: number) {
    this.setState({
      start,
      end,
    });

    this.onSelectHandler(start, end);
  }

  render() {
    const state = this.state;
    const days = this.props.days;
    const title = this.props.title;

    let color = this.props.color || "gray";

    return (
      <div className="text-nowrap" style={{ height: "20px" }}>
        <div
          className="d-inline-block text-left day-title"
          style={{ width: "160px", height: "20px", verticalAlign: "top" }}
        >
          <span
            onClick={() => {
              this.onTitleClickHandler();
            }}
          >
            {title}
          </span>
        </div>
        {days.map((d: any) => {
          let day = d.day;
          let selectedStart = Math.min(state.start, state.end);
          let selectedEnd = Math.max(state.start, state.end);
          let selected = false;
          if (selectedStart <= day && selectedEnd >= day) {
            selected = true;
          }

          return (
            <div
              key={d.day}
              className={
                "d-inline-block text-center day-select" +
                ` ${selected ? "selected" : ""}` +
                ` ${color}`
              }
              data-day={d.day}
              data-weekday={d.weekday}
              style={{
                width: "20px",
                height: "20px",
              }}
              onClick={(e: React.MouseEvent) => {
                let day = parseInt(e.currentTarget.getAttribute("data-day"));
                if (
                  this.state.start >= day &&
                  this.state.end <= day &&
                  this.end == -1
                ) {
                  this.start = -1;
                  this.end = -1;
                } else {
                  this.start = day;
                  this.end = day;
                }

                this.clicked = false;
                this.dragging = false;

                this.setSelectDate(this.start, this.end);
              }}
              onMouseDown={(e: React.MouseEvent) => {
                let day = parseInt(e.currentTarget.getAttribute("data-day"));

                this.start = day;
                this.end = -1;
                this.clicked = true;
                this.dragging = false;
              }}
              onMouseUp={(e: React.MouseEvent) => {
                if (this.dragging) {
                  this.clicked = false;
                  this.dragging = false;

                  this.setSelectDate(this.start, this.end);
                }
              }}
              onMouseOver={(e: React.MouseEvent) => {
                if (this.clicked) {
                  let day = parseInt(e.currentTarget.getAttribute("data-day"));

                  this.dragging = true;
                  this.end = day;

                  this.setState({
                    start: this.start,
                    end: this.end,
                  });
                }
              }}
            ></div>
          );
        })}
      </div>
    );
  }
}
