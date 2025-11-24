import { Splitter, SplitterPanel } from "primereact/splitter";
import TablesViewWrap from "../sql/objectView/tablesView";
import { ConnectionStoreProvider } from "../sql/sql.context";
import ConnectionForm from "../sql/objectView/connectionForm";
import EditableTableColumns from "./editableTableColumns";
import { Button } from "primereact/button";
import { useRef } from "react";
import { useSqlLoaderSourceStore } from "./sqlLoader.store";
import { InputTextarea } from "primereact/inputtextarea";

const SqlLoaderSourceForm = () => {
  const sourceStore = useSqlLoaderSourceStore();
  const sourceColumnRef = useRef<any>();

  return (
    <ConnectionStoreProvider name="sqlLoader.source">
      <Splitter layout="vertical">
        <SplitterPanel className="overflow-hidden d-flex flex-column">
          <div className="mb-1">
            <ConnectionForm
              onChange={(connInfo: ConnInfo) => {
                sourceStore.setConnName(connInfo.name);
              }}
            />
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <TablesViewWrap
              name="sqlLoader.source.tableView"
              onClick={({ item }: any) => {
                sourceStore.setOwner(item.owner);
                sourceStore.setTableName(item.tableName);
              }}
            />
          </div>
        </SplitterPanel>
        <SplitterPanel className="overflow-hidden d-flex flex-column">
          <div className="flex-grow-1 overflow-hidden">
            <EditableTableColumns
              ref={sourceColumnRef}
              name="sqlLoader.source.editableTableColumns"
              filter={{ owner: sourceStore.owner, tableName: sourceStore.tableName }}
            />
          </div>
          <div className="text-end mt-1">
            <Button
              label="생성"
              size="small"
              onClick={(e) => {
                const sourceCellValues = sourceColumnRef.current.getCellValues(1);
                const sourceColumns = sourceCellValues.join(",\r\n       ");
                const generatedQuery = `select ${sourceColumns}\r\n  from ${sourceStore.owner}.${sourceStore.tableName}`;

                sourceStore.setQuery(generatedQuery);
              }}
            />
          </div>
          <div style={{ height: "250px", minHeight: "150px" }}>
            <InputTextarea
              className="w-100 h-100"
              value={sourceStore.query}
              onChange={(e) => sourceStore.setQuery(e.target.value)}
            />
          </div>
        </SplitterPanel>
      </Splitter>
    </ConnectionStoreProvider>
  );
};

export default SqlLoaderSourceForm;
