import { create } from "zustand";

type FileCommandType = {
  command: string;
  //   path?: string;
  files?: FileType[];
};

type FileCommandState = FileCommandType & {};

type FileCommandAction = {
  setCommand: (command: string) => void;
  //   setPath: (path: string) => void;
  setFiles: (files: FileType[]) => void;
  reset: () => void;
};

export const useFileCommandStore = create<FileCommandState & FileCommandAction>((set) => ({
  command: "",
  //   path: "",
  files: [],
  setCommand: (command: string) => set({ command }),
  //   setPath: (path: string) => set({ path }),
  setFiles: (files: FileType[]) => set({ files: [...files] }),
  reset: () =>
    set({
      command: "",
      files: [],
    }),
}));

type FileIndexingState = {
  jobId: string;
  isRunning: boolean;
  indexingFiles: string[];
  setJobId: (jobId: string) => void;
  setRunning: (isRunning: boolean) => void;
  setIndexingFiles: (indexingFiles: string[]) => void;
};

export const useFileIndexingStore = create<FileIndexingState>((set) => ({
  jobId: null,
  isRunning: false,
  indexingFiles: [],
  setJobId: (jobId: string) => set({ jobId }),
  setRunning: (isRunning: boolean) => set({ isRunning }),
  setIndexingFiles: (indexingFiles: string[]) => set({ indexingFiles }),
}));
