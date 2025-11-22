import { Splitter, SplitterPanel } from "primereact/splitter";
import { ConnectionStoreProvider } from "../sql/sql.context";
import { useExcelLoaderTargetStore } from "./excelLoader.store";
import ConnectionForm from "../sql/objectView/connectionForm";
import EditableTableColumns from "./editableTableColumns";
import TablesViewWrap from "../sql/objectView/tablesView";
import { forwardRef, useImperativeHandle, useRef } from "react";

const ExcelLoaderTargetForm = forwardRef((props, ref: any) => {
  const targetSource = useExcelLoaderTargetStore();
  const targetColumnRef = useRef<any>();

  useImperativeHandle(
    ref,
    () => ({
      getCellValues: (index: number) => {
        return targetColumnRef.current.getCellValues(index);
      },
    }),
    [targetSource],
  );

  return (
    <ConnectionStoreProvider name="sqlExcelLoader">
      <Splitter layout="vertical">
        <SplitterPanel className="overflow-hidden d-flex flex-column">
          <div className="mb-1">
            <ConnectionForm
              onChange={(connInfo: ConnInfo) => {
                targetSource.setConnName(connInfo.name);
              }}
            />
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <TablesViewWrap
              name="sqlExcelLoader.tableView"
              onClick={({ item }: any) => {
                targetSource.setOwner(item.owner);
                targetSource.setTableName(item.tableName);
              }}
            />
          </div>
        </SplitterPanel>
        <SplitterPanel className="overflow-hidden">
          <EditableTableColumns
            ref={targetColumnRef}
            filter={{ owner: targetSource.owner, tableName: targetSource.tableName }}
            editable={false}
          />
        </SplitterPanel>
      </Splitter>
    </ConnectionStoreProvider>
  );
});

export default ExcelLoaderTargetForm;
