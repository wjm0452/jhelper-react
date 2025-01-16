import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

type TablesViewFilterFormProps = {
  filter: TableFilter;
  setFilter: (data: any) => void;
};

const TablesViewFilterForm = ({ filter, setFilter }: TablesViewFilterFormProps) => {
  const [owner, setOwner] = useState(filter.owner);
  const [tableName, setTableName] = useState(filter.tableName);

  useEffect(() => {
    setOwner(filter.owner);
  }, [filter.owner]);

  useEffect(() => {
    setTableName(filter.tableName);
  }, [filter.tableName]);

  return (
    <>
      <div>
        <div className="p-inputgroup flex-1">
          <InputText
            type="text"
            value={owner}
            placeholder="owner"
            onChange={(e) => setOwner(e.currentTarget.value)}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, owner, tableName });
              }
            }}
          />
          <InputText
            type="text"
            value={tableName}
            placeholder="table"
            onChange={(e) => setTableName(e.currentTarget.value)}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, owner, tableName });
              }
            }}
          />
          <Button icon="pi pi-search" onClick={(e) => setFilter({ ...filter, owner, tableName })} />
        </div>
      </div>
    </>
  );
};

export default TablesViewFilterForm;
