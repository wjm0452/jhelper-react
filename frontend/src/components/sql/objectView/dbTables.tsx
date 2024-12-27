import { useEffect } from "react";
import TableView from "../../common/tableViewer";
import { useGetTables } from "../query";
import { useConnectionStore, useSearchTablesStore } from "../store";

const SearchTableForm = () => {
  const searchTablesStore = useSearchTablesStore();
  const { refetch: refetchGetTables } = useGetTables(searchTablesStore);

  return (
    <>
      <div className="row g-1">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            style={{ width: "10rem" }}
            value={searchTablesStore.owner}
            placeholder="owner"
            onChange={(e) => {
              //   this.cacheContext.setCaches({
              //     owner: e.currentTarget.value,
              //   });
              searchTablesStore.put("owner", e.currentTarget.value);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                refetchGetTables();
              }
            }}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            style={{ width: "10rem" }}
            value={searchTablesStore.tableName}
            placeholder="table"
            onChange={(e) => {
              searchTablesStore.put("tableName", e.currentTarget.value);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                refetchGetTables();
              }
            }}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary btn-sm me-1"
            onClick={(e) => {
              refetchGetTables();
            }}
          >
            find
          </button>
        </div>
      </div>
    </>
  );
};

const DbTables = (props: any) => {
  const searchTablesStore = useSearchTablesStore();
  const { data: tables, refetch: refetchGetTables } = useGetTables(searchTablesStore);
  const clickHandler = props.onClick || function () {};

  useEffect(() => {
    if (searchTablesStore.owner) {
      refetchGetTables();
    }
  }, []);

  return (
    <>
      <SearchTableForm></SearchTableForm>
      <div className="mt-1 overflow-auto">
        <TableView
          header={tables?.columnNames}
          data={tables?.result}
          onClick={(item: string[]) => {
            clickHandler(item);
          }}
        ></TableView>
      </div>
    </>
  );
};

export default DbTables;
