import { jsqlInstance } from "../api";

const makeSelectQuery = async (data: { name: string; owner: string; tableName: string }) => {
  return jsqlInstance.selectQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: data.name },
  );
};
const makeInsertQuery = async (data: { name: string; owner: string; tableName: string }) => {
  return jsqlInstance.insertQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: data.name },
  );
};
const makeUpdateQuery = async (data: { name: string; owner: string; tableName: string }) => {
  return jsqlInstance.updateQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: data.name },
  );
};
const makeDeleteQuery = async (data: { name: string; owner: string; tableName: string }) => {
  return jsqlInstance.deleteQuery(
    { owner: data.owner, tableName: data.tableName },
    { name: data.name },
  );
};

export default {
  makeSelectQuery,
  makeInsertQuery,
  makeUpdateQuery,
  makeDeleteQuery,
};
