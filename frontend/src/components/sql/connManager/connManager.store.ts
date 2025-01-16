import { create } from "zustand";

type ConnManagerState = {
  visible: boolean;
  hide: () => void;
  show: () => void;
};

export const useConnManagerStore = create<ConnManagerState>((set) => ({
  visible: false,
  hide: () => set({ visible: false }),
  show: () => set({ visible: true }),
}));

type ConnInfoState = ConnInfo & {};

type ConnInfoAction = {
  setConnInfo: (connInfo: ConnInfo) => void;
  put: (key: string, value: any) => void;
  reset: () => void;
};

const initialState: ConnInfoState = {
  name: "",
  vendor: "",
  jdbcUrl: "",
  driverClassName: "",
  username: "",
  password: "",
};

export const useConnInfoStore = create<ConnInfoState & ConnInfoAction>((set) => ({
  ...initialState,
  setConnInfo: (connInfo: ConnInfo) => set({ ...connInfo }),
  put: (key: string, value: any) => set({ [key]: value }),
  reset: () => set(initialState),
}));
