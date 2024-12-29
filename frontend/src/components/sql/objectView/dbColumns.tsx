import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from "react";
import TableView from "../../common/tableViewer";
import { useGetColumns } from "../query";

type ColumnFilterFormProps = {
  filter: ColumnFilter;
  setFilter: (data: any) => void;
};

const ColumnFilterForm = ({ filter, setFilter }: ColumnFilterFormProps) => {
  const [tableName, setTableName] = useState("");
  const [columnName, setColumnName] = useState("");

  useEffect(() => {
    setTableName(filter.tableName);
  }, [filter.tableName]);

  useEffect(() => {
    setColumnName(filter.columnName);
  }, [filter.columnName]);

  return (
    <>
      <div className="col-auto">
        <input
          type="text"
          className="form-control"
          placeholder="table"
          value={tableName}
          onChange={(e) => {
            setTableName(e.currentTarget.value);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              setFilter({ ...filter, tableName, columnName });
            }
          }}
        />
      </div>
      <div className="col-auto">
        <input
          type="text"
          className="form-control"
          placeholder="column"
          value={columnName}
          onChange={(e) => {
            setColumnName(e.currentTarget.value);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              setFilter({ ...filter, tableName, columnName });
            }
          }}
        />
      </div>
      <div className="col-auto">
        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => setFilter({ ...filter, tableName, columnName })}
        >
          find
        </button>
      </div>
    </>
  );
};

const DbColumns = forwardRef((props: any, ref) => {
  const [filter, setFilter] = useState<ColumnFilter>({
    owner: "",
    tableName: "",
    columnName: "",
  });
  const [enabledFetch, setEnabledFetch] = useState(false);
  const { data } = useGetColumns(filter, { enabled: enabledFetch });
  const clickHandler = props.onClick || function () {};

  useImperativeHandle(
    ref,
    () => ({
      getFilter: () => ({ ...filter }),
      setFilter: onApply,
    }),
    [filter],
  );

  const onApply = (filter: ColumnFilter) => {
    setFilter({ ...filter });
    setEnabledFetch(true);
  };

  return (
    <>
      <div className="row g-1">
        <ColumnFilterForm filter={filter} setFilter={onApply}></ColumnFilterForm>
      </div>
      <div className="mt-1 overflow-auto" style={{ height: "300px" }}>
        <TableView
          header={data?.columnNames}
          data={data?.result}
          onClick={(item: string[]) => {
            clickHandler({
              ...filter,
              tableName: item[0],
              columName: item[1],
            });
          }}
        ></TableView>
      </div>
    </>
  );
});

export default DbColumns;
