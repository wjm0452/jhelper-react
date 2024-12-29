import { create } from "zustand";

type BoardState = Board & {};

type BoardAction = {
  putAll: (values: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

const initialBoardState: BoardState = {
  id: "",
  title: "",
  content: "",
  registerId: "",
  registerDate: new Date().toISOString().slice(0, 16),
};

export const useBoardStore = create<BoardState & BoardAction>((set) => ({
  ...initialBoardState,
  putAll: (values: any) => set({ ...values }),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));

type SearchBoardsState = SearchBoards & {};

type SearchBoardsAction = {
  put: (key: string, value: any) => void;
  reset: () => void;
};

export const useSearchBoardsStore = create<SearchBoardsState & SearchBoardsAction>((set) => ({
  page: 0,
  pageSize: 10,
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({}),
}));
