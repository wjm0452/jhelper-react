import { useEffect } from "react";
import { useGetConnInfoList } from "../connManager/query";
import { useConnectionStore } from "../store";
import { useLoadTemplate } from "../query";
import { useConnManagerStore } from "../connManager/store";

const ConnectionForm = () => {
  const connManagerStore = useConnManagerStore();
  const connectionStore = useConnectionStore();
  const { data: connInfoList } = useGetConnInfoList();
  const { refetch: refetchLoadTemplate } = useLoadTemplate(connectionStore.vendor);

  useEffect(() => {
    if (connectionStore.vendor) {
      refetchLoadTemplate();
    }
  }, [connectionStore.vendor]);

  return (
    <div className="row g-1">
      <div className="col-auto">
        <select
          className="form-select"
          value={connectionStore.name}
          onChange={(e) => {
            //   this.cacheContext.setCaches({
            //     name: e.currentTarget.value,
            //   });
            const value: string = e.currentTarget.value;
            if (value) {
              const connInfo = connInfoList.find(({ name }) => name == value);
              connectionStore.setConnInfo(connInfo);
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
