import { Splitter, SplitterPanel } from "primereact/splitter";
import { ConnectionStoreProvider } from "../sql/sql.context";
import ConnectionForm from "../sql/objectView/connectionForm";
import EditableTableColumns from "./editableTableColumns";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TablesViewWrap from "../sql/objectView/tablesView";
import { useSqlLoaderTargetStore } from "./sqlLoader.store";

const SqlLoaderTargetForm = forwardRef((props, ref) => {
  const targetStore = useSqlLoaderTargetStore();
  const targetColumnRef = useRef<any>();

  useImperativeHandle(
    ref,
    () => ({
      getCellValues: (headerRowCount: number) => {
        return targetColumnRef.current.getCellValues(headerRowCount);
      },
    }),
    [targetStore],
  );

  return (
    <ConnectionStoreProvider name="sqlLoader.target">
      <Splitter layout="vertical">
        <SplitterPanel className="overflow-hidden d-flex flex-column">
          <div className="mb-1">
            <ConnectionForm
              onChange={(connInfo: ConnInfo) => {
                targetStore.setConnName(connInfo.name);
              }}
            />
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <TablesViewWrap
              name="sqlLoader.target.tableView"
              onClick={({ item }: any) => {
                targetStore.setOwner(item.owner);
                targetStore.setTableName(item.tableName);
              }}
            />
          </div>
        </SplitterPanel>
        <SplitterPanel className="overflow-hidden">
          <EditableTableColumns
            ref={targetColumnRef}
            name="sqlLoader.target.editableTableColumns"
            filter={{ owner: targetStore.owner, tableName: targetStore.tableName }}
            editable={false}
          />
        </SplitterPanel>
      </Splitter>
    </ConnectionStoreProvider>
  );
});

export default SqlLoaderTargetForm;
