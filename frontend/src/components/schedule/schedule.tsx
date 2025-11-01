import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useScheduleStore } from "./schedule.store";
import { useState } from "react";

const DetailForm = (props: any) => {
  const item = { fromDate: "", toDate: "", title: "", content: "" };

  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="row g-3 flex-grow-0">
          <div className="flex gap-3">
            <div className="flex-auto">
              <label className="font-bold block mb-2">From</label>
              <InputText type="datetime-local" value={item.fromDate} className="w-full" />
            </div>
            <div className="flex-auto">
              <label className="font-bold block mb-2">To</label>
              <InputText type="datetime-local" value={item.toDate} className="w-full" />
            </div>
          </div>
          <div className="flex-auto">
            <label className="font-bold block mb-2">제목</label>
            <InputText type="text" value={item.title} className="w-full" />
          </div>
          <div className="flex-auto">
            <label className="font-bold block mb-2">내용</label>
            <InputTextarea value={item.content} className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
};

function getLastDay(date: Date) {
  let month = date.getMonth();
  let d = new Date();
  d.setMonth(month + 1);
  d.setDate(0);

  return d.getDate();
}

function getFirstDayOfWeek(date: Date) {
  let d = new Date(date);
  d.setDate(1);
  return d.getDay();
}

function dateToYearMonth(date: Date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  return `${year}년 ${month}월`;
}

const RenderWeekHeader = (daysInMonth: number, firstDayOfWeek: number) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="d-flex" style={{ width: "100%", marginBottom: "8px" }}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const weekDayIdx = (firstDayOfWeek + i) % 7;
        const weekDay = weekDays[weekDayIdx];
        let color = undefined;
        if (weekDayIdx === 0) color = "red";
        if (weekDayIdx === 6) color = "blue";
        return (
          <div className="d-inline-block text-center" style={{ width: "40px", color }} key={"weekday-" + i}>
            {weekDay}
          </div>
        );
      })}
    </div>
  );
};

const RenderDayCells = (daysInMonth: number, firstDayOfWeek: number) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="d-flex" style={{ width: "100%" }}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const weekDayIdx = (firstDayOfWeek + i) % 7;
        let color = undefined;
        if (weekDayIdx === 0) color = "red"; // 일요일
        if (weekDayIdx === 6) color = "blue"; // 토요일
        return (
          <div className="d-inline-block text-center" style={{ width: "40px", color }} key={"day-" + (i + 1)}>
            {i + 1}
          </div>
        );
      })}
    </div>
  );
};

const RenderDayEmptyCells = (daysInMonth: number, firstDayOfWeek: number) => {
  const [dragging, setDragging] = useState(false);
  const [startIndex, setStartIndex] = useState(-1);
  const [endIndex, setEndIndex] = useState(-1);

  return (
    <div className="d-flex" style={{ width: "100%" }}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const color =
          startIndex !== -1 &&
          endIndex !== -1 &&
          i >= Math.min(startIndex, endIndex) &&
          i <= Math.max(startIndex, endIndex)
            ? "bg-primary bg-opacity-25"
            : "";

        return (
          <div
            className={
              "d-inline-block text-center border-dashed border-0 border-bottom-1 border-dashed border-300 " + color
            }
            style={{ width: "40px", height: "40px" }}
            key={"day-" + (i + 1)}
            onMouseDown={() => {
              setDragging(true);
              setStartIndex(i);
              setEndIndex(i);
            }}
            onMouseUp={() => {
              setDragging(false);
              setEndIndex(i);
            }}
            onMouseOver={() => {
              if (dragging) {
                setEndIndex(i);
              }
            }}
          ></div>
        );
      })}
    </div>
  );
};

const DateForm = (props: any) => {
  const scheduleStore = useScheduleStore();

  const daysInMonth = getLastDay(scheduleStore.date); // 9월 기준
  const firstDayOfWeek = getFirstDayOfWeek(scheduleStore.date); // 1: 일요일

  return (
    <div className="w-100">
      <div>
        <Button
          icon="pi pi-angle-left"
          rounded
          text
          aria-label="Prev"
          label=""
          title="Prev"
          onClick={() => {
            let d = new Date(scheduleStore.date);
            d.setMonth(d.getMonth() - 1);
            scheduleStore.put("date", d);
          }}
        />
        <InputText type="text" value={dateToYearMonth(scheduleStore.date)} className="text-center" />
        <Button
          icon="pi pi-angle-right"
          rounded
          text
          aria-label="Next"
          label=""
          title="Next"
          onClick={() => {
            let d = new Date(scheduleStore.date);
            d.setMonth(d.getMonth() + 1);
            scheduleStore.put("date", d);
          }}
        />
      </div>
      <div style={{ marginTop: "16px", overflowX: "auto", whiteSpace: "nowrap" }}>
        {RenderWeekHeader(daysInMonth, firstDayOfWeek)}
        {RenderDayCells(daysInMonth, firstDayOfWeek)}
        {RenderDayEmptyCells(daysInMonth, firstDayOfWeek)}
      </div>
    </div>
  );
};

const Schedule = (props: any) => {
  return (
    <Splitter className="w-100 h-100" stateStorage="session" stateKey="schedule.splitter">
      <SplitterPanel size={20} className="overflow-hidden p-1">
        <DetailForm />
      </SplitterPanel>
      <SplitterPanel size={80} className="overflow-hidden p-1">
        <DateForm />
      </SplitterPanel>
    </Splitter>
  );
};

export default Schedule;
