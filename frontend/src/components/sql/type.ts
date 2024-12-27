type ConnInfo = {
  name: string;
  vendor: string;
  jdbcUrl: string;
  driverClassName: string;
  username: string;
  password: string;
};

type SearchTables = {
  owner: string;
  tableName: string;
};

type SearchColumns = {
  owner: string;
  tableName: string;
  columnName: string;
};

type SqlResult = {
  columnNames: string[];
  result: string[][];
  count: number;
};

type SearchQuery = {
  query: string;
  fetchSize: number;
  sqlResult: SqlResult;
};
