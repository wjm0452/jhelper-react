import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SqlEditorState = {
  value: string;
  setValue: (value: string) => void;
};

export const useSqlEditorState = create(
  persist<SqlEditorState>(
    (set) => ({
      value: "",
      setValue: (value: string) => {
        set({ value });
      },
    }),
    {
      name: "sqlEditor.store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
