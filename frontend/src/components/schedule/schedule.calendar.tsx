import { Button } from "primereact/button";
import { useScheduleStore } from "./schedule.store";
import { InputText } from "primereact/inputtext";
import CalendarHeader from "./schedule.calendar.header";
import { useGetScheduleList, useSaveSchedules } from "./schedule.query";
import CalendarBody from "./schedule.calendar.body";
import { useEffect } from "react";
import { SelectButton } from "primereact/selectbutton";
import { ToggleButton } from "primereact/togglebutton";

const getHeaderDateString = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

const ScheduleCalendar = (props: any) => {
  const scheduleStore = useScheduleStore();
  const currentDate = scheduleStore.date;
  const datesInCalendar = scheduleStore.getFilteredDates();
  const { data: schedules } = useGetScheduleList({
    year: useScheduleStore().date.getFullYear(),
    month: useScheduleStore().date.getMonth() + 1,
  });

  const { mutateAsync: mutateSaveSchedules } = useSaveSchedules();

  useEffect(() => {
    if (schedules) {
      scheduleStore.put("schedules", schedules);
    }
  }, [schedules]);

  return (
    <div className="w-100">
      <div className="d-flex flex-row">
        <div className="flex-grow-1 d-flex justify-content-center align-items-center gap-3">
          <Button
            icon="pi pi-angle-left"
            rounded
            text
            aria-label="Prev"
            label=""
            title="Prev"
            onClick={() => {
              let d = new Date(currentDate);
              d.setMonth(d.getMonth() - 1);
              scheduleStore.setDate(d);
            }}
          />
          <InputText type="text" value={getHeaderDateString(currentDate)} className="text-center" />
          <Button
            icon="pi pi-angle-right"
            rounded
            text
            aria-label="Next"
            label=""
            title="Next"
            onClick={() => {
              let d = new Date(currentDate);
              d.setMonth(d.getMonth() + 1);
              scheduleStore.setDate(d);
            }}
          />
        </div>
        <div>
          <ToggleButton
            onLabel="Hide Holidays"
            offLabel="Show Holidays"
            checked={!scheduleStore.showHoliday}
            onChange={(e) => {
              scheduleStore.setShowHoliday(!e.value);
            }}
          />
          <ToggleButton
            onLabel="Editable"
            offLabel="Read-Only"
            checked={scheduleStore.editable}
            onChange={(e) => {
              scheduleStore.setEditable(e.value);
            }}
          />
          <Button
            icon="pi pi-refresh"
            aria-label="Today"
            label="Today"
            title="Today"
            text
            onClick={() => {
              scheduleStore.setDate(new Date());
            }}
          />
          <Button
            icon="pi pi-save"
            aria-label="Save"
            label="Save"
            title="Save"
            text
            onClick={() => {
              mutateSaveSchedules(scheduleStore.schedules);
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px", overflowX: "auto", whiteSpace: "nowrap" }}>
        <CalendarHeader date={currentDate} datesInCalendar={datesInCalendar}></CalendarHeader>
        <CalendarBody date={currentDate} datesInCalendar={datesInCalendar}></CalendarBody>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
