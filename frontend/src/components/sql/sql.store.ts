import { create } from "zustand";

type PutAction = {
  putAll: (values: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

type CommandQueryState = FetchQuery & {
  sqlState: string;
  errorMessage: string;
};

type CommandQueryAction = PutAction & {
  setQuery: (query: string) => void;
  setFetchSize: (fetchSize: number) => void;
  setSqlResult: (sqlResult: SqlResult) => void;
  setSqlState: (sqlState: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  resetQuery: () => void;
};

const initialCommandQueryState: CommandQueryState = {
  query: "",
  fetchSize: 100,
  sqlResult: {
    columnNames: [],
    result: [],
    count: 0,
  },
  sqlState: "",
  errorMessage: "",
};

export const useCommandQueryStore = create<CommandQueryState & CommandQueryAction>((set) => ({
  ...initialCommandQueryState,
  setQuery: (query: string) => set({ query: query }),
  setFetchSize: (fetchSize: number) => set({ fetchSize: fetchSize }),
  setSqlResult: (sqlResult: SqlResult) => set({ sqlResult: sqlResult }),
  setSqlState: (sqlState: string) => set({ sqlState: sqlState }),
  setErrorMessage: (errorMessage: string) => set({ errorMessage: errorMessage }),
  putAll: (values: any) => set((state) => ({ ...state, ...values })),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set({ ...initialCommandQueryState }),
  resetQuery: () => {
    set({
      query: "",
      sqlResult: {
        columnNames: [],
        result: [],
        count: 0,
      },
      sqlState: "",
      errorMessage: "",
    });
  },
}));
