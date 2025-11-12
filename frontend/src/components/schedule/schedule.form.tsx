import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { useDeleteSchedule, useSaveSchedule } from "./schedule.query";
import { dateUtils } from "../../common/dateUtils";
import { useScheduleStore } from "./schedule.store";
import { ColorPicker } from "primereact/colorpicker";

type ScheduleInputFormProps = {};

const ScheduleInputForm = (props: ScheduleInputFormProps) => {
  const { mutateAsync: mutateSaveSchedule } = useSaveSchedule();
  const { mutateAsync: mutateDeleteSchedule } = useDeleteSchedule();

  const scheduleStore = useScheduleStore();
  const selectedScheduleId = scheduleStore.selectedScheduleId;
  const schedules = scheduleStore.schedules;
  const schedule = schedules?.find((s) => s.id === selectedScheduleId) || {
    id: null,
    fromDate: "",
    toDate: "",
    title: "",
    content: "",
    color: "d3d3d3",
  };

  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="row g-3 flex-grow-0">
          <div className="flex gap-3">
            <div className="flex-auto">
              <label className="font-bold block mb-2">From</label>
              <Calendar
                dateFormat="yy-mm-dd"
                value={schedule.fromDate ? new Date(schedule.fromDate) : null}
                showIcon
                onChange={(e: any) => {
                  schedule.fromDate = dateUtils.toString(e.value, "yyyy-MM-dd");
                  scheduleStore.put("schedules", [...schedules]);
                }}
              />
            </div>
            <div className="flex-auto">
              <label className="font-bold block mb-2">To</label>
              <Calendar
                dateFormat="yy-mm-dd"
                value={schedule.toDate ? new Date(schedule.toDate) : null}
                showIcon
                onChange={(e: any) => {
                  schedule.toDate = dateUtils.toString(e.value, "yyyy-MM-dd");
                  scheduleStore.put("schedules", [...schedules]);
                }}
              />
            </div>
            <div className="flex-auto">
              <label className="font-bold block mb-2">색상</label>
              <ColorPicker
                format="hex"
                className="w-full"
                value={schedule.color}
                onChange={(e) => {
                  schedule.color = e.value.toString();
                  scheduleStore.put("schedules", [...schedules]);
                }}
              />
            </div>
          </div>
          <div className="flex-auto">
            <label className="font-bold block mb-2">제목</label>
            <InputText
              type="text"
              className="w-full"
              value={schedule.title}
              onChange={(e) => {
                schedule.title = e.target.value;
                scheduleStore.put("schedules", [...schedules]);
              }}
            />
          </div>
          <div className="flex-auto">
            <label className="font-bold block mb-2">내용</label>
            <InputTextarea
              className="w-full"
              rows={10}
              value={schedule.content}
              onChange={(e) => {
                schedule.content = e.target.value;
                scheduleStore.put("schedules", [...schedules]);
              }}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              label="신규"
              icon="pi pi-plus"
              size="small"
              text
              severity="secondary"
              onClick={() => {
                // 기존에 신규로 추가했던것이 있으면 선택만하고 추가 안함
                if (schedules.length && schedules[0].id === null) {
                  scheduleStore.put("selectedScheduleId", schedules[0].id);
                  return;
                }

                schedules.unshift({
                  id: null,
                  fromDate: dateUtils.toString(new Date(), "yyyy-MM-dd"),
                  toDate: dateUtils.toString(new Date(), "yyyy-MM-dd"),
                  title: "",
                  content: "",
                  color: "d3d3d3",
                });

                scheduleStore.put("selectedScheduleId", null);
                scheduleStore.put("schedules", [...schedules]);
              }}
            />
            <Button
              label="저장"
              icon="pi pi-check"
              size="small"
              text
              onClick={async () => {
                const savedSchedule = await mutateSaveSchedule(schedule);
                scheduleStore.put("selectedScheduleId", savedSchedule.id);
              }}
            />
            <Button
              label="삭제"
              icon="pi pi-trash"
              size="small"
              text
              onClick={async () => {
                await mutateDeleteSchedule(schedule.id);
                scheduleStore.put("selectedSchedule", null);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleInputForm;
