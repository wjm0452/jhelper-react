import { createContext, ReactNode, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const ConnectionStoreContext = createContext(null);

type ConnectionStoreProviderProps = {
  name: string;
  children?: ReactNode | undefined;
};

export const ConnectionStoreProvider = ({ name, children }: ConnectionStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ConnectionState>>();
  if (!storeRef.current) {
    storeRef.current = create(
      persist<ConnectionState>(
        (set) => ({
          name: "",
          vendor: "",
          jdbcUrl: "",
          driverClassName: "",
          username: "",
          password: "",
          setConnInfo: (connInfo: ConnInfo) => set({ ...connInfo }),
        }),
        {
          name: name + ".store",
          storage: createJSONStorage(() => localStorage),
        },
      ),
    );
  }

  return (
    <ConnectionStoreContext.Provider value={storeRef.current}>
      {children}
    </ConnectionStoreContext.Provider>
  );
};

export const useConnectionStoreInContext = (selector?: any) => {
  return useStore<StoreApi<ConnectionState>>(
    useContext<StoreApi<ConnectionState>>(ConnectionStoreContext),
  );
};
