import { create } from "zustand";

type ScheduleState = {
  date: Date;
};

type ScheduleAction = {
  putAll: (data: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

export const useScheduleStore = create<ScheduleState & ScheduleAction>((set) => ({
  date: new Date(),
  putAll: (data: any) => set(data),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));
