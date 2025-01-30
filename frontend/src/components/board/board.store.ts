import { create } from "zustand";

type SearchBoardsState = PagingData & {
  filter: string;
  category: string;
};

type SearchBoardsAction = {
  putAll: (data: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

export const useSearchBoardsStore = create<SearchBoardsState & SearchBoardsAction>((set) => ({
  filter: "",
  category: "board",
  page: 0,
  size: 10,
  putAll: (data: any) => set(data),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));
