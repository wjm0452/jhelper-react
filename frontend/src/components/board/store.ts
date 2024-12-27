import { create } from "zustand";

type BoardState = Board & {
  putAll: (values: any) => void;
  put: (key: string, value: any) => void;
  clear: () => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  id: "",
  title: "",
  content: "",
  registerId: "",
  registerDate: new Date().toISOString().slice(0, 16),
  putAll: (values: any) => set({ ...values }),
  put: (key: string, value: any) => {
    set({ [key]: value });
  },
  clear: () => set({}),
}));

type SearchBoardsState = SearchBoards & {
  putAll: (values: any) => void;
  put: (key: string, value: any) => void;
  clear: () => void;
};

export const useSearchBoardsStore = create<SearchBoardsState>((set) => ({
  page: 0,
  pageSize: 10,
  putAll: (values: any) => set({ ...values }),
  put: (key: string, value: any) => {
    set({ [key]: value });
  },
  clear: () => set({}),
}));
