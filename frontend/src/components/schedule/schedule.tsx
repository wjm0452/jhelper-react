import { Splitter, SplitterPanel } from "primereact/splitter";
import ScheduleInputForm from "./schedule.form";
import ScheduleCalendar from "./schedule.calendar";

const Schedule = (props: any) => {
  return (
    <Splitter className="w-100 h-100" stateStorage="session" stateKey="schedule.splitter">
      <SplitterPanel size={20} className="overflow-hidden p-1">
        <ScheduleInputForm />
      </SplitterPanel>
      <SplitterPanel size={80} className="overflow-hidden p-1">
        <ScheduleCalendar />
      </SplitterPanel>
    </Splitter>
  );
};

export default Schedule;
