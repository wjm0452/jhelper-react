import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import TableView from "../../common/tableViewer";
import { useGetColumns } from "../sql.query";
import ObjectViewColumnsFilterForm from "./columnsView.filterForm";

type ColumnsViewProps = {
  owner: string;
  tableName: string;
  onClick?: (data: any) => void;
};

const ColumnsView = forwardRef(({ owner, tableName, onClick }: ColumnsViewProps, ref) => {
  const [filter, setFilter] = useState<ColumnFilter>({
    owner: "",
    tableName: "",
    columnName: "",
  });

  const { data } = useGetColumns(filter);

  useEffect(() => {
    setFilter({ owner, tableName, columnName: "" });
  }, [owner, tableName]);

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
  };

  return (
    <>
      <div>
        <ObjectViewColumnsFilterForm filter={filter} setFilter={onApply} />
      </div>
      <div className="mt-1 overflow-auto" style={{ height: "300px" }}>
        <TableView
          header={data?.columnNames}
          data={data?.result}
          onClick={(item: string[]) => {
            onClick &&
              onClick({
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

export default ColumnsView;
