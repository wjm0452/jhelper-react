import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";

const ConnectionStoreContext = createContext(null);

export const ConnectionStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<StoreApi<ConnectionState>>();
  if (!storeRef.current) {
    storeRef.current = create<ConnectionState>((set) => ({
      name: "",
      vendor: "",
      jdbcUrl: "",
      driverClassName: "",
      username: "",
      password: "",
      setConnInfo: (connInfo: ConnInfo) => set({ ...connInfo }),
    }));
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
