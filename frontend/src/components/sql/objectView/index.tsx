import { useRef } from "react";
import ConnectionForm from "./connectionForm";
import DbColumns from "./dbColumns";
import DbTables from "./dbTables";

const CommandButtons = ({ onClick }: { onClick: (command: string) => void }) => {
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => onClick("addSelectQuery")}
      >
        select
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => onClick("addInsertQuery")}
      >
        insert
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={() => onClick("addUpdateQuery")}
      >
        update
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm me-1"
        onClick={(e) => onClick("addDeleteQuery")}
      >
        delete
      </button>
    </>
  );
};

const ObjectView = (props: any) => {
  const columnsRef = useRef<any>();

  return (
    <div className="d-flex flex-column h-100 p-2">
      <div className="flex-grow-1">
        <div className="mb-1">
          <ConnectionForm />
        </div>
        <DbTables
          onClick={(data: any) => {
            columnsRef.current.setFilter({
              owner: data.owner,
              tableName: data.tableName,
              columnName: "",
            });
          }}
        ></DbTables>
      </div>
      <div>
        <DbColumns ref={columnsRef}></DbColumns>
        <div>
          <CommandButtons
            onClick={(command: string) => {
              const columnFilter = columnsRef.current.getFilter();
              props.onCommand({
                command: command,
                data: {
                  owner: columnFilter.owner,
                  tableName: columnFilter.tableName,
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ObjectView;
