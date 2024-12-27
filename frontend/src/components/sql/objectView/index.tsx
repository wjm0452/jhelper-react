import { useSearchColumnsStore, useSearchTablesStore } from "../store";
import ConnectionForm from "./connectionForm";
import DbColumns from "./dbColumns";
import DbTables from "./dbTables";

const ObjectView = (props: any) => {
  const searchTablesStore = useSearchTablesStore();
  const searchColumnsStore = useSearchColumnsStore();

  return (
    <div className="d-flex flex-column h-100 p-2">
      <div className="flex-grow-1">
        <ConnectionForm></ConnectionForm>
        <DbTables
          onClick={(data: any) => {
            searchColumnsStore.reset();
            searchColumnsStore.put("owner", searchTablesStore.owner);
            searchColumnsStore.put("tableName", data[0]);
          }}
        ></DbTables>
      </div>
      <div>
        <DbColumns
          onClick={(data: any) => {
            props.onCommand({
              command: data.name,
              data: {
                owner: searchColumnsStore.owner,
                tableName: searchColumnsStore.tableName,
              },
            });
          }}
        ></DbColumns>
      </div>
    </div>
  );
};

export default ObjectView;
