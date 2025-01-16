import { TabPanel, TabView } from "primereact/tabview";
import { CSSProperties, forwardRef, useImperativeHandle, useState } from "react";
import guid from "../../../common/guid";
import {
  useDeleteTableBookmark,
  useGetTableBookmarks,
  useGetTables,
  useSaveTableBookmark,
} from "../sql.query";
import TablesViewFilterForm from "./tablesView.filterForm";
import { TableViewStoreProvider, useTableViewStoreInContext } from "./tableView.context";

type TablesViewProps = {
  name: string;
  isBookmark?: boolean;
  onClick: (data: any) => void;
};

const TablesViewWrap = (tablesViewProps: TablesViewProps) => {
  return (
    <TableViewStoreProvider name={tablesViewProps.name}>
      <TablesView {...tablesViewProps}></TablesView>
    </TableViewStoreProvider>
  );
};

const TablesView = ({ name, isBookmark = false, onClick }: TablesViewProps) => {
  const tableViewStore = useTableViewStoreInContext();

  return (
    <div className="h-100 d-flex flex-column">
      <TablesViewFilterForm
        filter={tableViewStore.filter}
        setFilter={(filter: TableFilter) => {
          tableViewStore.setFilter({ ...filter });
        }}
      />
      <div className="mt-1 flex-grow-1 overflow-hidden">
        <TabView
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          panelContainerStyle={{ flexGrow: "1", overflow: "hidden", padding: "0px" }}
        >
          <TabPanel header="Tables" style={{ height: "100%" }}>
            <TableList
              {...tableViewStore.filter}
              isBookmark={isBookmark}
              onClick={(e) => {
                onClick && onClick(e);
              }}
            ></TableList>
          </TabPanel>
          <TabPanel header="Bookmark" style={{ height: "100%" }}>
            <BookmarkList
              {...tableViewStore.filter}
              isBookmark={isBookmark}
              onClick={(e) => {
                onClick && onClick(e);
              }}
            ></BookmarkList>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

type TableListProps = TableFilter & {
  isBookmark: boolean;
  onClick?: (data: any) => void;
};

const TableList = ({ owner, tableName, isBookmark, onClick }: TableListProps) => {
  const { data } = useGetTables({ owner, tableName });
  const { data: tableBookmarks } = useGetTableBookmarks({ owner, tableName });
  const { mutateAsync: saveMutateAsync } = useSaveTableBookmark();
  const { mutateAsync: deleteMutateAsync } = useDeleteTableBookmark();

  const BookmarkIcon = ({
    item,
  }: {
    item: { owner: string; tableName: string; comments: string };
  }) => {
    let icon = "pi-bookmark";
    const bookmark = tableBookmarks?.find(
      (bookmark: TableBookmark) => bookmark.tableName == item.tableName,
    );

    if (bookmark) {
      icon = "pi-bookmark-fill";
    }

    return (
      <i
        className={`pi ${icon}`}
        onClick={() => {
          if (bookmark) {
            deleteMutateAsync(bookmark);
          } else {
            saveMutateAsync({
              owner: item.owner,
              tableName: item.tableName,
              comments: item.comments,
            });
          }
        }}
      />
    );
  };

  return (
    <div className="h-100 overflow-auto">
      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            {data?.columnNames.map((columnName) => (
              <th key={guid()} className="text-center">
                {columnName}
              </th>
            ))}
            {isBookmark ? <th></th> : <></>}
          </tr>
        </thead>
        <tbody>
          {data?.result.map((item: string[], rowIndex: number) => (
            <tr key={`${rowIndex}`}>
              {item.map((value: string, cellIndex) => (
                <td
                  key={`${rowIndex}_${cellIndex}`}
                  onClick={() => {
                    onClick &&
                      onClick({
                        rowIndex,
                        cellIndex,
                        item: { owner, tableName: item[0], comments: item[1] },
                      });
                  }}
                >
                  {value}
                </td>
              ))}
              {isBookmark ? (
                <td className="text-center">
                  <BookmarkIcon
                    item={{ owner, tableName: item[0], comments: item[1] }}
                  ></BookmarkIcon>
                </td>
              ) : (
                <></>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type BookmarkListProps = TableFilter & {
  isBookmark: boolean;
  onClick?: (data: any) => void;
};

const BookmarkList = ({ owner, tableName, isBookmark, onClick }: BookmarkListProps) => {
  const { data: tableBookmarks } = useGetTableBookmarks({ owner, tableName });
  const { mutateAsync: deleteMutateAsync } = useDeleteTableBookmark();

  const BookmarkIcon = ({ tableName }: { tableName: string }) => {
    return (
      <i
        className={`pi pi-bookmark-fill`}
        onClick={() => {
          const bookmark = tableBookmarks.find(
            (bookmark: TableBookmark) => bookmark.tableName == tableName,
          );
          deleteMutateAsync(bookmark);
        }}
      />
    );
  };

  return (
    <div className="h-100 overflow-auto">
      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th className="text-center">table_name</th>
            <th className="text-center">comments</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableBookmarks?.map((item: any, rowIndex: number) => (
            <tr key={`${rowIndex}`}>
              <td
                onClick={() => {
                  onClick &&
                    onClick({
                      rowIndex,
                      cellIndex: 0,
                      item: { owner, tableName: item.tableName, comments: item.comments },
                    });
                }}
              >
                {item.tableName}
              </td>
              <td>{item.comments}</td>
              <td className="flex justify-content-center">
                <BookmarkIcon tableName={item.tableName}></BookmarkIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablesViewWrap;
