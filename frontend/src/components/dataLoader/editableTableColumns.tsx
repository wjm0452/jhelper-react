import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetColumnsWithName } from "../sql/sql.query";
import TableView from "../common/tableViewer";
import JButtons from "../common/buttons";
import jUtils from "../../common/jUtils";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

type EditableColumnsProps = {
  items: any;
  setItems: (items: any) => void;
  editable: boolean;
  onClick?: ({ index, item }: { index: number; item: any }) => void;
};

const EditableColumns = ({ items, setItems, editable, onClick }: EditableColumnsProps) => {
  return (
    <tbody>
      {items.map((row: string[], i: number) => (
        <tr
          key={`head_${i}`}
          onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
            onClick && onClick({ index: i, item: items[i] });
          }}
        >
          <td className="text-end">{i + 1}</td>
          <td>{row[0]}</td>
          <td>
            {editable ? (
              <input
                type="text"
                className="h-100 w-100"
                onChange={(e) => {
                  items[i][1] = e.target.value;
                  setItems([...items]);
                }}
                value={row[1]}
              />
            ) : (
              row[1]
            )}
          </td>
          <td>{row[2]}</td>
          <td>{row[3]}</td>
          <td>{row[4]}</td>
          {editable ? (
            <th className="text-center">
              <button
                className="btn btn-secondary btn-sm me-1"
                onClick={() => {
                  items.splice(i, 1);
                  setItems([...items]);
                }}
              >
                삭제
              </button>
            </th>
          ) : (
            <></>
          )}
        </tr>
      ))}
    </tbody>
  );
};

type EditableTableColumnsProps = {
  name?: string;
  filter: TableFilter;
  editable?: boolean;
};

const EditableTableColumns = forwardRef(({ filter, name, editable = true }: EditableTableColumnsProps, ref: any) => {
  const { data, isPending, isFetching } = useGetColumnsWithName(
    { ...filter, columnName: "" },
    { enabled: true, name: name },
  );
  const columnNames = isPending || isFetching ? ["Select table..."] : ["No", ...data?.columnNames];
  if (!isPending && !isFetching && editable) {
    columnNames.push("");
  }

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  useEffect(() => {
    setItems(data?.result || []);
  }, [data]);

  useImperativeHandle(
    ref,
    () => ({
      getCellValues: (index: number) => {
        return items.map((item) => item[index]);
      },
      getItems: () => {
        return Object.freeze(items);
      },
      getMappingInfo: () => {},
    }),
    [items],
  );

  return (
    <>
      <div className="h-100 overflow-hidden d-flex flex-column">
        {editable ? (
          <div className="text-end">
            <ButtonGroup>
              <Button
                icon="pi pi-plus"
                size="small"
                onClick={(e) => {
                  setItems([...items, ["", "", "", "", ""]]);
                }}
              />
              <Button
                icon="pi pi-arrow-up"
                size="small"
                onClick={(e) => {
                  const index = items.findIndex((item) => item[1] == selectedItem[1]);
                  setItems(jUtils.move(items, index, index - 1));
                }}
              />
              <Button
                icon="pi pi-arrow-down"
                size="small"
                onClick={(e) => {
                  const index = items.findIndex((item) => item[1] == selectedItem[1]);
                  setItems(jUtils.move(items, index, index + 1));
                }}
              />
            </ButtonGroup>
          </div>
        ) : (
          <></>
        )}
        <div className="flex-grow-1 overflow-auto">
          <TableView.TableWrap>
            <TableView.Headers data={columnNames} />
            <EditableColumns
              items={items}
              setItems={setItems}
              editable={editable}
              onClick={(data) => setSelectedItem(data.item)}
            ></EditableColumns>
          </TableView.TableWrap>
        </div>
      </div>
    </>
  );
});

export default EditableTableColumns;
