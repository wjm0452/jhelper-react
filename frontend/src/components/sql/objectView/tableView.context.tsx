import { createContext, ReactNode, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const TableViewStoreContext = createContext(null);

type TableViewState = {
  filter: TableFilter;
  setFilter: (filter: TableFilter) => void;
};

type TableViewStoreProviderProps = {
  name: string;
  children?: ReactNode | undefined;
};

export const TableViewStoreProvider = ({ name, children }: TableViewStoreProviderProps) => {
  const storeRef = useRef<StoreApi<TableViewState>>();
  if (!storeRef.current) {
    storeRef.current = create(
      persist<TableViewState>(
        (set) => ({
          filter: {
            owner: "",
            tableName: "",
          },
          setFilter: (filter: TableFilter) => {
            set({ filter });
          },
        }),
        {
          name: name + ".store",
          storage: createJSONStorage(() => localStorage),
        },
      ),
    );
  }

  return (
    <TableViewStoreContext.Provider value={storeRef.current}>
      {children}
    </TableViewStoreContext.Provider>
  );
};

export const useTableViewStoreInContext = (selector?: any) => {
  return useStore<StoreApi<TableViewState>>(
    useContext<StoreApi<TableViewState>>(TableViewStoreContext),
  );
};
