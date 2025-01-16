import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import ColumnsView from "./columnsView";
import ConnectionForm from "./connectionForm";
import IndexesView from "./indexesView";
import TablesView from "./tablesView";
import { ButtonGroup } from "primereact/buttongroup";
import { Button } from "primereact/button";

const CommandButtons = ({ onClick }: { onClick: (command: string) => void }) => {
  return (
    <>
      <ButtonGroup>
        <Button label="Select" size="small" text onClick={() => onClick("addSelectQuery")} />
        <Button label="Insert" size="small" text onClick={() => onClick("addInsertQuery")} />
        <Button label="Update" size="small" text onClick={() => onClick("addUpdateQuery")} />
        <Button label="Delete" size="small" text onClick={(e) => onClick("addDeleteQuery")} />
      </ButtonGroup>
    </>
  );
};

const ObjectView = (props: any) => {
  const [selectedTable, setSelectedTable] = useState({
    owner: "",
    tableName: "",
  });

  return (
    <div className="h-100 w-100 d-flex flex-column">
      <div className="flex-grow-1 overflow-hidden d-flex flex-column">
        <div className="mb-1">
          <ConnectionForm />
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <TablesView
            name="sql.tableView"
            isBookmark={true}
            onClick={({ item }: any) => {
              setSelectedTable({ owner: item.owner, tableName: item.tableName });
            }}
          ></TablesView>
        </div>
      </div>
      <div style={{ height: "500px" }}>
        <TabView panelContainerStyle={{ padding: "0px" }}>
          <TabPanel header="Columns">
            <div className="mb-1">
              <CommandButtons
                onClick={(command: string) => {
                  props.onCommand({
                    command: command,
                    data: {
                      owner: selectedTable.owner,
                      tableName: selectedTable.tableName,
                    },
                  });
                }}
              />
            </div>
            <ColumnsView
              owner={selectedTable.owner}
              tableName={selectedTable.tableName}
            ></ColumnsView>
          </TabPanel>
          <TabPanel header="Indexes">
            <IndexesView
              owner={selectedTable.owner}
              tableName={selectedTable.tableName}
            ></IndexesView>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default ObjectView;
