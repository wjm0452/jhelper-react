import { create } from "zustand";

type ExcelLoaderSourceState = {
  filePath: string;
  startRow: number;
  startCol: number;
  queryParams: string;
};

type ExcelLoaderSourceAction = {
  setFilePath: (filePath: string) => void;
  setStartRow: (startRow: number) => void;
  setStartCol: (startCol: number) => void;
  setQueryParams: (queryParams: string) => void;
};

export const useExcelLoaderSourceStore = create<ExcelLoaderSourceState & ExcelLoaderSourceAction>((set) => ({
  filePath: "",
  startRow: 0,
  startCol: 0,
  queryParams: "",
  setFilePath: (filePath: string) => set({ filePath }),
  setStartRow: (startRow: number) => set({ startRow }),
  setStartCol: (startCol: number) => set({ startCol }),
  setQueryParams: (queryParams: string) => set({ queryParams }),
}));

type ExcelLoaderTargetState = {
  connName: string;
  owner: string;
  tableName: string;
};

type ExcelLoaderTargetAction = {
  setConnName: (connName: string) => void;
  setOwner: (owner: string) => void;
  setTableName: (tableName: string) => void;
};

export const useExcelLoaderTargetStore = create<ExcelLoaderTargetState & ExcelLoaderTargetAction>((set) => ({
  connName: "",
  owner: "",
  tableName: "",
  setConnName: (connName: string) => set({ connName }),
  setOwner: (owner: string) => set({ owner }),
  setTableName: (tableName: string) => set({ tableName }),
}));
