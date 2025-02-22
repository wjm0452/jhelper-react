import { useNavigate } from "react-router-dom";
import { useDeleteBoards, useGetBoardList } from "./board.query.ts";
import { useSearchBoardsStore } from "./board.store.ts";
import { useEffect, useState } from "react";
import { DataTable, DataTableRowClickEvent, DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { dateUtils } from "../../common/dateUtils.ts";
import { Dropdown } from "primereact/dropdown";
import { useMessageStoreInContext } from "../common/message/message.context.tsx";

const BoardList = () => {
  const searchBoardStore = useSearchBoardsStore();
  const { data: { items, totalElements } = {} } = useGetBoardList({
    filter: searchBoardStore.filter,
    category: searchBoardStore.category,
    page: searchBoardStore.page,
    size: searchBoardStore.size,
  });
  const { mutateAsync: mutateDeleteBoards } = useDeleteBoards();
  const messageStore = useMessageStoreInContext();

  const [filter, setFilter] = useState(searchBoardStore.filter);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const header = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <Button
            type="button"
            icon="pi pi-plus"
            label="등록"
            text
            onClick={() => {
              navigate(`/board/details`);
            }}
          />
          <Button
            type="button"
            icon="pi pi-minus"
            label="삭제"
            text
            disabled={selectedItems.length <= 0}
            onClick={async () => {
              if (await messageStore.confirm("선택한 게시물을 삭제 하시겠습니까?")) {
                mutateDeleteBoards(selectedItems.map((item) => item.id));
              }
            }}
          />
        </div>
        <div className="flex">
          <Dropdown
            value={searchBoardStore.category}
            onChange={(e) => {
              searchBoardStore.put("category", e.value);
            }}
            options={[
              { code: "", name: "전체" },
              { code: "board", name: "게시판" },
              { code: "file", name: "파일" },
            ]}
            optionLabel="name"
            optionValue="code"
            className="w-full text-base me-1"
          />
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  searchBoardStore.put("filter", filter);
                }
              }}
              placeholder="Search..."
            />
          </IconField>
        </div>
      </div>
    );
  };

  return (
    <DataTable
      value={items}
      resizableColumns
      stripedRows
      selectionMode="multiple"
      selection={selectedItems}
      onSelectionChange={(e: any) => setSelectedItems(e.value)}
      dataKey="id"
      lazy
      paginator
      first={searchBoardStore.page * searchBoardStore.size}
      rows={searchBoardStore.size}
      totalRecords={totalElements || 0}
      rowsPerPageOptions={[10, 15, 25, 50, 100]}
      tableStyle={{ minWidth: "50rem" }}
      onPage={(e: DataTableStateEvent) => {
        searchBoardStore.putAll({ page: e.page, size: e.rows });
      }}
      onRowDoubleClick={(e: DataTableRowClickEvent) => navigate(`/board/details/${e.data.id}`)}
      header={header}
    >
      <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
      <Column field="id" header="#" align="right" style={{ width: "3rem" }}></Column>
      <Column field="category" header="카테고리" align="center" style={{ width: "5rem" }}></Column>
      <Column
        field="title"
        header="제목"
        style={{ width: "" }}
        filter
        filterPlaceholder=""
      ></Column>
      <Column field="registerId" header="작성자" align="center" style={{ width: "15rem" }}></Column>
      <Column
        field="registerDate"
        header="작성일"
        align="center"
        style={{ width: "15rem" }}
        body={({ registerDate }) => dateUtils.toString(dateUtils.toDate(registerDate))}
      ></Column>
    </DataTable>
  );
};

const Board = () => {
  return (
    <div className="v-100 h-100 overflow-auto">
      <div className="p-5">
        <BoardList />
      </div>
    </div>
  );
};

export default Board;
