import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";
import AlertMessage from "./alertMessage";
import ConfirmMessage from "./confirmMessage";
import guid from "../../../common/guid";
import { Toast } from "primereact/toast";

type AlertMessageOptions = {
  header?: string;
};

type ConfirmMessageOptions = {
  header?: string;
  icon?: string;
};

type ToastOptions = {
  severity?: string;
  life?: number;
};

const MessageStoreContext = createContext(null);

type MessageStoreProviderProps = {
  children?: ReactNode | undefined;
};

type AlertStateType = {
  alertMessages: any[];
  alert: (message: string, options?: AlertMessageOptions) => Promise<void>;
};

type ConfirmStateType = {
  confirmMessages: any[];
  confirm: (message: string, options?: ConfirmMessageOptions) => Promise<boolean>;
};

type ToastStateType = {
  toastMessage: any;
  toast: (title: string, message: string, options?: ToastOptions) => void;
};

type MessageState = AlertStateType & ConfirmStateType & ToastStateType;

export const MessageStoreProvider = ({ children }: MessageStoreProviderProps) => {
  const storeRef = useRef<StoreApi<MessageState>>();
  if (!storeRef.current) {
    storeRef.current = create((set) => ({
      alertMessages: [] as any[],
      confirmMessages: [] as any[],
      toastMessage: {} as any,
      alert: async (message: string, options: AlertMessageOptions = {}): Promise<void> => {
        const props: any = {
          header: options.header || "",
          message: message,
          guid: guid(),
        };

        const promise = new Promise<void>((resolve: any, reject: any) => {
          props.onClose = () => {
            set((state) => {
              return { alertMessages: state.alertMessages.filter((item) => item != props) };
            });
            resolve();
          };
        });

        set((state) => {
          return { alertMessages: [...state.alertMessages, props] };
        });

        return promise;
      },
      confirm: (message: string, options: ConfirmMessageOptions = {}): Promise<boolean> => {
        const props: any = {
          ...options,
          message: message,
          guid: guid(),
        };

        const promise = new Promise<boolean>((resolve: any) => {
          props.accept = () => {
            set((state) => {
              return {
                confirmMessages: state.confirmMessages.filter((item) => item.guid != props.guid),
              };
            });
            resolve(true);
          };

          props.reject = () => {
            set((state) => {
              return {
                confirmMessages: state.confirmMessages.filter((item) => item.guid != props.guid),
              };
            });
            resolve(false);
          };
        });

        set((state) => {
          return { confirmMessages: [...state.confirmMessages, props] };
        });

        return promise;
      },
      toast: (title: string, message: string, options: ToastOptions = {}) => {
        const props: any = {
          ...options,
          title,
          message,
          guid: guid(),
        };

        set({ toastMessage: props });
      },
    }));
  }

  return (
    <MessageStoreContext.Provider value={storeRef.current}>
      {children}
      <MessageDialogs />
    </MessageStoreContext.Provider>
  );
};

const MessageDialogs = () => {
  const messageStore = useMessageStoreInContext();
  const toast = useRef<Toast>();

  useEffect(() => {
    const toastMessage = messageStore.toastMessage;
    if (toastMessage && toastMessage.message) {
      toast.current.show({
        severity: toastMessage.severity || "info",
        summary: toastMessage.title,
        detail: toastMessage.message,
        life: toastMessage.lifeTime || 3000,
      });
    }
  }, [messageStore.toastMessage]);

  return (
    <>
      {messageStore.confirmMessages.map((item) => (
        <ConfirmMessage key={item.guid} {...item} />
      ))}
      {messageStore.alertMessages.map((item) => (
        <AlertMessage key={item.guid} {...item} />
      ))}
      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export const useMessageStoreInContext = (selector?: any) => {
  return useStore<StoreApi<MessageState>>(useContext<StoreApi<MessageState>>(MessageStoreContext));
};
