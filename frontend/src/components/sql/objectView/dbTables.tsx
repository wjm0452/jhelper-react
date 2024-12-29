import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TableView from "../../common/tableViewer";
import { useGetTables } from "../query";

type TableFilterFormProps = {
  filter: TableFilter;
  setFilter: (data: any) => void;
};

const TableFilterForm = ({ filter, setFilter }: TableFilterFormProps) => {
  const [owner, setOwner] = useState("");
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    setOwner(filter.owner);
  }, [filter.owner]);

  useEffect(() => {
    setTableName(filter.tableName);
  }, [filter.tableName]);

  return (
    <>
      <div className="row g-1">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            style={{ width: "10rem" }}
            value={owner}
            placeholder="owner"
            onChange={(e) => setOwner(e.currentTarget.value)}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, owner, tableName });
              }
            }}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            style={{ width: "10rem" }}
            value={tableName}
            placeholder="table"
            onChange={(e) => setTableName(e.currentTarget.value)}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, owner, tableName });
              }
            }}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary btn-sm me-1"
            onClick={(e) => setFilter({ ...filter, owner, tableName })}
          >
            find
          </button>
        </div>
      </div>
    </>
  );
};

const DbTables = forwardRef((props: any, ref) => {
  const [filter, setFilter] = useState<TableFilter>({
    owner: "",
    tableName: "",
  });
  const [enabledFetch, setEnabledFetch] = useState(false);
  const { data } = useGetTables(filter, { enabled: enabledFetch });
  const clickHandler = props.onClick || function () {};

  useImperativeHandle(
    ref,
    () => ({
      getFilter: () => ({ ...filter }),
      setFilter: onApply,
    }),
    [filter],
  );

  const onApply = (filter: TableFilter) => {
    setFilter({ ...filter });
    setEnabledFetch(true);
  };

  return (
    <>
      <TableFilterForm filter={filter} setFilter={onApply} />
      <div className="mt-1 overflow-auto">
        <TableView
          header={data?.columnNames}
          data={data?.result}
          onClick={(item: string[]) => {
            clickHandler({
              ...filter,
              tableName: item[0],
              comments: item[1],
            });
          }}
        ></TableView>
      </div>
    </>
  );
});

export default DbTables;
