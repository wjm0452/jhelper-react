import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FileBrowserState = {
  path: string;
  _historyIndex: number;
  _pathHistory: string[];
  filter: FileBrowserFilterType;
  activeFile: FileType;
  selectedFiles: FileType[];
};

type FileBrowserAction = {
  setActiveFile: (file: FileType) => void;
  setSelectedFiles: (files: FileType[]) => void;
  setPath: (path: string) => void;
  prev: () => void;
  next: () => void;
  putAll: (data: any) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

const initialFilter: FileBrowserFilterType = {
  type: "",
  name: "",
  from: "",
  to: "",
  exclusionName: "",
  includeSubDirs: false,
};

export const useFileBrowserStore = create(
  persist<FileBrowserState & FileBrowserAction>(
    (set) => ({
      path: "",
      _pathHistory: [],
      _historyIndex: -1,
      filter: {
        ...initialFilter,
      },
      activeFile: null,
      selectedFiles: [],
      setActiveFile: (file: FileType) => set({ activeFile: file }),
      setSelectedFiles: (files: FileType[]) => set({ selectedFiles: files }),
      setPath: (path: string) => {
        set((state) => {
          let pathHistory = state._pathHistory;
          let historyIndex = state._historyIndex;

          if (historyIndex < pathHistory.length - 1) {
            pathHistory.splice(historyIndex + 1);
          }

          pathHistory.push(path);

          // maximum history
          if (pathHistory.length > 50) {
            pathHistory.splice(0, pathHistory.length - 50);
          }

          state._historyIndex = pathHistory.length - 1;
          state.path = path;
          return { ...state, filter: { ...initialFilter } };
        });
      },
      prev: () => {
        set((state) => {
          let historyIndex = state._historyIndex;
          if (historyIndex == 0) {
            return state;
          }

          historyIndex--;
          state._historyIndex = historyIndex;
          state.path = state._pathHistory[historyIndex];

          return { ...state };
        });
      },
      next: () => {
        set((state) => {
          let historyIndex = state._historyIndex;
          if (historyIndex >= state._pathHistory.length - 1) {
            return state;
          }

          historyIndex++;
          state._historyIndex = historyIndex;
          state.path = state._pathHistory[historyIndex];

          return { ...state };
        });
      },
      putAll: (data: any) => set(data),
      put: (key: string, value: any) => set({ [key]: value }),
      reset: () =>
        set({
          path: "",
          _pathHistory: [],
          _historyIndex: -1,
          filter: { ...initialFilter },
        }),
    }),
    {
      name: "fileBrowser.store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
