import { create } from "zustand";

type SqlLoaderSourceState = {
  connName: string;
  owner: string;
  tableName: string;
  query: string;
};

type SqlLoaderSourceAction = {
  setConnName: (connName: string) => void;
  setOwner: (owner: string) => void;
  setTableName: (tableName: string) => void;
  setQuery: (query: string) => void;
};

export const useSqlLoaderSourceStore = create<SqlLoaderSourceState & SqlLoaderSourceAction>((set) => ({
  connName: "",
  owner: "",
  tableName: "",
  query: "",
  setConnName: (connName: string) => set({ connName }),
  setOwner: (owner: string) => set({ owner }),
  setTableName: (tableName: string) => set({ tableName }),
  setQuery: (query: string) => set({ query }),
}));

type SqlLoaderTargetState = {
  connName: string;
  owner: string;
  tableName: string;
};

type SqlLoaderTargetAction = {
  setConnName: (connName: string) => void;
  setOwner: (owner: string) => void;
  setTableName: (tableName: string) => void;
};

export const useSqlLoaderTargetStore = create<SqlLoaderTargetState & SqlLoaderTargetAction>((set) => ({
  connName: "",
  owner: "",
  tableName: "",
  setConnName: (connName: string) => set({ connName }),
  setOwner: (owner: string) => set({ owner }),
  setTableName: (tableName: string) => set({ tableName }),
}));
