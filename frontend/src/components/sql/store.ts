import { create } from "zustand";

type ConnectionState = ConnInfo & {
  setConnInfo: (connInfo: ConnInfo) => void;
};

export const useConnectionStore = create<ConnectionState>((set) => ({
  name: "",
  vendor: "",
  jdbcUrl: "",
  driverClassName: "",
  username: "",
  password: "",
  setConnInfo: (connInfo: ConnInfo) => set({ ...connInfo }),
}));

type PutAction = {
  put: (key: string, value: any) => void;
  reset: () => void;
};

const initialSearchTablesState: SearchTables = {
  owner: "",
  tableName: "",
};

export const useSearchTablesStore = create<SearchTables & PutAction>((set) => ({
  ...initialSearchTablesState,
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set(initialSearchTablesState),
}));

const initialSearchColumnsState: SearchColumns = {
  owner: "",
  tableName: "",
  columnName: "",
};

export const useSearchColumnsStore = create<SearchColumns & PutAction>((set) => ({
  ...initialSearchColumnsState,
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set(initialSearchColumnsState),
}));

type SearchQueryState = SearchQuery & {
  sqlState: string;
  errorMessage: string;
};

type SearchQueryAction = {
  put: (key: string, value: any) => void;
  reset: () => void;
  resetQuery: () => void;
};

const initialSearchQueryState: SearchQueryState = {
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

export const useSearchQueryStore = create<SearchQueryState & SearchQueryAction>((set) => ({
  ...initialSearchQueryState,
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set(initialSearchQueryState),
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
