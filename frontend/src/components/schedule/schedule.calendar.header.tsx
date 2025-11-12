const CalendarHeader = ({ date, datesInCalendar }: { date: Date; datesInCalendar: Date[] }) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  return (
    <>
      <div className="d-flex" style={{ marginBottom: "8px" }}>
        {datesInCalendar.map((date, i) => {
          const weekDayIdx = date.getDay();
          const weekDay = weekDays[weekDayIdx];
          let color = undefined;
          let opacity = 0.5;

          if (weekDayIdx === 0) color = "red";
          if (weekDayIdx === 6) color = "blue";

          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            opacity = 1;
          }

          return (
            <div className="d-inline-block text-center" style={{ width: "40px", color, opacity }} key={"weekday-" + i}>
              {weekDay}
            </div>
          );
        })}
      </div>
      <div className="d-flex">
        {datesInCalendar.map((date, i) => {
          const day = date.getDate();
          const weekDayIdx = date.getDay();
          let color = undefined;
          let opacity = 0.5;

          if (weekDayIdx === 0) color = "red"; // 일요일
          if (weekDayIdx === 6) color = "blue"; // 토요일

          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            opacity = 1;
          }

          return (
            <div className="d-inline-block text-center" style={{ width: "40px", color, opacity }} key={"day-" + i}>
              {day}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CalendarHeader;
