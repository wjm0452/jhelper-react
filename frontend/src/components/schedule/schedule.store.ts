import { create } from "zustand";

type ScheduleState = {
  date: Date;
  datesInCalendar: Date[];
  selectedScheduleId: number | null;
  schedules: Schedule[] | null;
  editable: boolean;
  showHoliday: boolean;
};

type ScheduleAction = {
  setDate: (date: Date) => void;
  setEditable: (editable: boolean) => void;
  setShowHoliday: (show: boolean) => void;
  getFilteredDates(): Date[];
  putAll: (data: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
  updateScheduleDateRange: (id: number, fromDate: string, toDate: string) => void;
};

const getDatesInCalendar = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDateInCurrentMonth = new Date(year, month, 1);
  const lastDateInCurrentMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDateInCurrentMonth.getDay();
  const lastDayOfWeek = lastDateInCurrentMonth.getDay();

  const startDate = new Date(year, month, firstDateInCurrentMonth.getDate() - firstDayOfWeek);
  const endDate = new Date(year, month, lastDateInCurrentMonth.getDate() + (6 - lastDayOfWeek));

  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export const useScheduleStore = create<ScheduleState & ScheduleAction>((set, get) => ({
  date: new Date(),
  editable: false,
  showHoliday: true,
  datesInCalendar: getDatesInCalendar(new Date()),
  selectedScheduleId: null,
  schedules: [],
  setDate: (date: Date) => {
    set({ date, datesInCalendar: getDatesInCalendar(date) });
  },
  setEditable: (editable: boolean) => {
    set({ editable });
  },
  setShowHoliday: (show: boolean) => {
    set({ showHoliday: show });
  },
  getFilteredDates: () => {
    const { date, showHoliday } = get();
    const dates = getDatesInCalendar(date);
    if (!showHoliday) {
      return dates.filter((date) => date.getDay() !== 0 && date.getDay() !== 6);
    }
    return dates;
  },
  updateScheduleDateRange: (id: number, fromDate: string, toDate: string) => {
    set((state: any) => {
      const updatedSchedules = state.schedules?.map((schedule: Schedule) => {
        if (schedule.id === id) {
          return { ...schedule, fromDate, toDate };
        }
        return schedule;
      });
      return { schedules: updatedSchedules || [] };
    });
  },
  putAll: (data: any) => set(data),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));
