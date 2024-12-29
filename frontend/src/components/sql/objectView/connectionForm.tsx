import { useEffect } from "react";
import { useGetConnInfoList } from "../connManager/query";
import { useLoadTemplate } from "../query";
import { useConnManagerStore } from "../connManager/store";
import { useConnectionStoreInContext } from "../context";

const ConnectionForm = () => {
  const connManagerStore = useConnManagerStore();
  const connectionStore = useConnectionStoreInContext();
  const { data: connInfoList } = useGetConnInfoList();
  const { refetch: refetchLoadTemplate } = useLoadTemplate(connectionStore.vendor);

  useEffect(() => {
    if (connectionStore.vendor) {
      refetchLoadTemplate();
    } else if (connInfoList?.length) {
      connectionStore.setConnInfo(connInfoList[0]);
    }
  }, [connectionStore.vendor, connInfoList?.length]);

  return (
    <div className="row g-1">
      <div className="col-auto">
        <select
          className="form-select"
          value={connectionStore.name}
          onChange={(e) => {
            const value: string = e.currentTarget.value;
            if (value) {
              connectionStore.setConnInfo(connInfoList.find(({ name }) => name == value));
            }
          }}
        >
          <option></option>
          {connInfoList?.map((conn: ConnInfo) => {
            return (
              <option key={conn.name} value={conn.name}>
                {conn.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="col-auto">
        <button
          className="btn btn-secondary btn-sm me-1"
          onClick={(e) => {
            connManagerStore.show();
          }}
        >
          settings
        </button>
      </div>
    </div>
  );
};

export default ConnectionForm;
