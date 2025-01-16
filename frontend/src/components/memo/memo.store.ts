import { create } from "zustand";

type MemoState = PagingData & {};

type MemoAction = {
  putAll: (data: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

export const useMemoStore = create<MemoState & MemoAction>((set) => ({
  page: 0,
  size: 5,
  putAll: (data: any) => set(data),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));
