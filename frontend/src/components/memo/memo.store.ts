import { create } from "zustand";

type MemoState = PagingData & {
  items: Memo[];
  filter: string;
};

type MemoAction = {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setFilter: (filter: string) => void;
  setItems: (items: Memo[]) => void;
};

export const useMemoStore = create<MemoState & MemoAction>((set) => ({
  page: 0,
  size: 50,
  filter: "",
  items: [],
  setPage: (page: number) => set({ page }),
  setSize: (size: number) => set({ size }),
  setFilter: (filter: string) => set({ filter }),
  setItems: (items: Memo[]) => set({ items }),
}));
