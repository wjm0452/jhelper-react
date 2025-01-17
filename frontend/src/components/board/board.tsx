import { useNavigate } from "react-router-dom";
import { useGetBoardList } from "./board.query.ts";
import { useSearchBoardsStore } from "./board.store.ts";
import { useState } from "react";
import { DataTable, DataTableRowClickEvent, DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { dateUtils } from "../../common/dateUtils.ts";

const BoardList = () => {
  const searchBoardStore = useSearchBoardsStore();
  const { data: { items, totalElements } = {} } = useGetBoardList({
    filter: searchBoardStore.filter,
    page: searchBoardStore.page,
    size: searchBoardStore.size,
  });

  const [headFilter, setHeadFilter] = useState(searchBoardStore.filter);
  const [selectedItem, setSelectedItem] = useState({});
  const navigate = useNavigate();

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-plus"
          label="등록"
          text
          onClick={() => navigate(`/board/details`)}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={headFilter}
            onChange={(e) => setHeadFilter(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                searchBoardStore.put("filter", headFilter);
              }
            }}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  return (
    <DataTable
      value={items}
      resizableColumns
      stripedRows
      selectionMode="single"
      selection={selectedItem}
      onSelectionChange={(e: any) => setSelectedItem(e.value)}
      //sortMode="single"
      dataKey="id"
      lazy
      paginator
      first={searchBoardStore.page * searchBoardStore.size}
      rows={searchBoardStore.size}
      totalRecords={totalElements || 0}
      rowsPerPageOptions={[10, 25, 50]}
      tableStyle={{ minWidth: "50rem" }}
      onPage={(e: DataTableStateEvent) => {
        searchBoardStore.putAll({ page: e.page, size: e.rows });
      }}
      onRowDoubleClick={(e: DataTableRowClickEvent) => navigate(`/board/details/${e.data.id}`)}
      header={renderHeader}
    >
      <Column field="id" header="#" style={{ width: "50px" }}></Column>
      <Column
        field="title"
        header="제목"
        style={{ width: "" }}
        filter
        filterPlaceholder=""
      ></Column>
      <Column field="registerId" header="작성자" style={{ width: "200px" }}></Column>
      <Column
        field="registerDate"
        header="작성일"
        style={{ width: "200px" }}
        body={({ registerDate }) => dateUtils.toString(dateUtils.toDate(registerDate))}
      ></Column>
    </DataTable>
  );
};

const Board = () => {
  const navigate = useNavigate();

  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="p-5">
        <BoardList />
      </div>
    </div>
  );
};

export default Board;
