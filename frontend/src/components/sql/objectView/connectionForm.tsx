import { useEffect } from "react";
import { useGetConnInfoList } from "../connManager/connManager.query";
import { useConnManagerStore } from "../connManager/connManager.store";
import { useConnectionStoreInContext } from "../sql.context";
import ConnManager from "../connManager";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const ConnectionForm = ({ onChange }: { onChange?: (connInfo: ConnInfo) => void }) => {
  const connManagerStore = useConnManagerStore();
  const connectionStore = useConnectionStoreInContext();
  const { data: connInfoList } = useGetConnInfoList();

  const triggerOnChangeHandler = (connInfo: ConnInfo) => {
    onChange && onChange(connInfo);
  };

  return (
    <>
      <ConnManager />
      <div className="p-inputgroup flex-1">
        <Dropdown
          value={connectionStore.name}
          onChange={(e) => {
            const value: string = e.value;
            if (value) {
              const connInfo = connInfoList.find(({ name }) => name == value);
              connectionStore.setConnInfo(connInfo);
              triggerOnChangeHandler(connInfo);
            } else {
              triggerOnChangeHandler(null);
            }
          }}
          options={connInfoList?.map((conn: ConnInfo) => {
            return { code: conn.name, name: conn.name };
          })}
          optionLabel="name"
          optionValue="code"
          className="w-full text-base"
        />
        <Button
          icon="pi pi-cog"
          onClick={(e) => {
            connManagerStore.show();
          }}
        />
      </div>
    </>
  );
};

export default ConnectionForm;
