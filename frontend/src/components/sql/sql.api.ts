import httpClient from "../../common/httpClient";
import Jsql from "./jsql";

const jsqlMap = new Map<string, any>();

const createJsql = () => {
  return new Jsql({
    url: "/api/sql",
  });
};

const getJsql = async (vendor: string) => {
  if (jsqlMap.has(vendor)) {
    return jsqlMap.get(vendor);
  } else {
    const jsql = createJsql();
    await jsql.loadTemplate(vendor);

    return jsql;
  }
};

export const fetchSql = async (query: string, params: any) => {
  return await httpClient.post("/api/sql", { query, ...params });
};

export const runSql = async (
  query: string,
  { name, fetchSize }: { name: string; fetchSize: number },
) => {
  query = query.trim();
  if (query.endsWith(";")) {
    query = query.substring(0, query.lastIndexOf(";"));
  }

  console.log("runSql %s", query);

  return await fetchSql(query, { name: name, fetchSize: fetchSize });
};

export const makeSelectQuery = async (
  data: {
    owner: string;
    tableName: string;
  },
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).selectQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: options.name },
  );
};

export const makeInsertQuery = async (
  data: {
    owner: string;
    tableName: string;
  },
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).insertQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: options.name },
  );
};

export const makeUpdateQuery = async (
  data: {
    owner: string;
    tableName: string;
  },
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).updateQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: options.name },
  );
};

export const makeDeleteQuery = async (
  data: {
    owner: string;
    tableName: string;
  },
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).deleteQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: options.name },
  );
};

export const findTables = async (
  tablelFilter: TableFilter,
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).findTableInfo(tablelFilter, { name: options.name });
};

export const findColumns = async (
  columnFilter: ColumnFilter,
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).findColumnInfo(columnFilter, { name: options.name });
};

export const findIndexes = async (
  tablelFilter: TableFilter,
  options: { name: string; vendor: string },
) => {
  return (await getJsql(options.vendor)).findIndexesInfo(tablelFilter, { name: options.name });
};

export const findTableBookmark = async (tableBookmark: TableBookmark) => {
  return await httpClient.get(`/api/table-bookmark`, null, {
    params: {
      name: tableBookmark.name,
      owner: tableBookmark.owner,
      tableName: tableBookmark.tableName,
    },
  });
};

export const saveTableBookmark = async (tableBookmark: TableBookmark) => {
  return await httpClient.post(`/api/table-bookmark`, {
    name: tableBookmark.name,
    owner: tableBookmark.owner,
    tableName: tableBookmark.tableName,
    comments: tableBookmark.comments,
  });
};

export const deleteTableBookmark = async (tableBookmark: TableBookmark) => {
  return await httpClient.delete(
    `/api/table-bookmark`,
    {},
    {
      params: {
        name: tableBookmark.name,
        owner: tableBookmark.owner,
        tableName: tableBookmark.tableName,
      },
    },
  );
};

export default {
  fetchSql,
  runSql,
  makeSelectQuery,
  makeInsertQuery,
  makeUpdateQuery,
  makeDeleteQuery,
  findTables,
  findColumns,
  findIndexes,
  findTableBookmark,
  saveTableBookmark,
  deleteTableBookmark,
};
