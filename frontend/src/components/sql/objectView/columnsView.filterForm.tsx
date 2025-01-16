import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

type ColumnsViewFilterFormProps = {
  filter: ColumnFilter;
  setFilter: (data: any) => void;
};

const ColumnsViewFilterForm = ({ filter, setFilter }: ColumnsViewFilterFormProps) => {
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
      <div className="p-inputgroup flex-1">
        <InputText
          type="text"
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
        <InputText
          type="text"
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
        <Button
          icon="pi pi-search"
          onClick={(e) => setFilter({ ...filter, tableName, columnName })}
        />
      </div>
    </>
  );
};

export default ColumnsViewFilterForm;
