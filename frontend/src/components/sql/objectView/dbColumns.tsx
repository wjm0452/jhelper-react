import { useEffect, useState } from "react";
import TableView from "../../common/tableViewer";
import { useGetColumns } from "../query";
import { useSearchColumnsStore, useSearchTablesStore } from "../store";

const CommandButtons = (props: any) => {
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => props.onClick({ name: "addSelectQuery" })}
      >
        select
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => props.onClick({ name: "addInsertQuery" })}
      >
        insert
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => props.onClick({ name: "addUpdateQuery" })}
      >
        update
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={(e) => props.onClick({ name: "addDeleteQuery" })}
      >
        delete
      </button>
    </>
  );
};

const DbColumns = (props: any) => {
  const searchColumnsStore = useSearchColumnsStore();
  const { data: columns, refetch: refetchGetColumns } = useGetColumns(searchColumnsStore);

  useEffect(() => {
    if (searchColumnsStore.owner && searchColumnsStore.tableName) {
      refetchGetColumns();
    }
  }, [searchColumnsStore.owner]);

  return (
    <>
      <div className="row g-1">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="table"
            value={searchColumnsStore.tableName}
            onChange={(e) => {
              searchColumnsStore.put("tableName", e.currentTarget.value);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                refetchGetColumns();
              }
            }}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="column"
            value={searchColumnsStore.columnName}
            onChange={(e) => {
              searchColumnsStore.put("columnName", e.currentTarget.value);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                refetchGetColumns();
              }
            }}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              refetchGetColumns();
            }}
          >
            find
          </button>
        </div>
        <div>
          <CommandButtons {...props}></CommandButtons>
        </div>
      </div>
      <div className="mt-1 overflow-auto" style={{ height: "300px" }}>
        <TableView header={columns?.columnNames} data={columns?.result}></TableView>
      </div>
    </>
  );
};

export default DbColumns;
