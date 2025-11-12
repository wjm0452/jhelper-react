import { useState } from "react";
import { dateUtils } from "../../common/dateUtils";
import { useScheduleStore } from "./schedule.store";

const CalendarRow = ({
  date,
  datesInCalendar,
  schedule,
}: {
  date: Date;
  datesInCalendar: Date[];
  schedule: Schedule;
}) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const fromDate = dateUtils.toDate(schedule.fromDate);
  const toDate = dateUtils.toDate(schedule.toDate);

  const scheduleStore = useScheduleStore();
  const editable = scheduleStore.editable;

  const [dragging, setDragging] = useState(false);
  const [selectDate, setSelectDate] = useState(fromDate);

  return (
    <div
      className="d-flex"
      onClick={() => {
        scheduleStore.put("selectedSchedule", schedule);
        scheduleStore.put("selectedScheduleId", schedule.id);
      }}
    >
      {datesInCalendar.map((date, i) => {
        let backgroundColor = undefined;
        let opacity = 0.5;

        if (date >= fromDate && date <= toDate) {
          backgroundColor = `#${schedule.color}` || "#d3d3d3";
        }

        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
          opacity = 1;
        }

        return (
          <div
            className="d-inline-block text-center border-solid border-0 border-bottom-1 border-300"
            style={{ width: "40px", height: "40px", backgroundColor, opacity }}
            key={"day-" + i}
            onMouseDown={() => {
              if (!editable) return;

              if (dragging) return;

              setDragging(true);
              setSelectDate(date);
              scheduleStore.updateScheduleDateRange(
                schedule.id,
                dateUtils.toString(date, "yyyy-MM-dd"),
                dateUtils.toString(date, "yyyy-MM-dd"),
              );
            }}
            onMouseUp={() => {
              if (!editable) return;
              setDragging(false);
            }}
            onMouseEnter={() => {
              if (!editable) return;
              if (dragging) {
                const targetDate = date;
                let newFromDate = selectDate;
                let newToDate = selectDate;
                if (targetDate < newFromDate) {
                  newFromDate = targetDate;
                } else if (targetDate > newToDate) {
                  newToDate = targetDate;
                }

                scheduleStore.updateScheduleDateRange(
                  schedule.id,
                  dateUtils.toString(newFromDate, "yyyy-MM-dd"),
                  dateUtils.toString(newToDate, "yyyy-MM-dd"),
                );
              }
            }}
          ></div>
        );
      })}
    </div>
  );
};

const CalendarBody = ({ date, datesInCalendar }: { date: Date; datesInCalendar: Date[] }) => {
  const scheduleStore = useScheduleStore();
  const schedules = scheduleStore.schedules;
  return (
    <>
      {schedules?.map((schedule) => (
        <CalendarRow
          key={"schedule-id-" + schedule.id}
          date={date}
          datesInCalendar={datesInCalendar}
          schedule={schedule}
        />
      ))}
    </>
  );
};

export default CalendarBody;
