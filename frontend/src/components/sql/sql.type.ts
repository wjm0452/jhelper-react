type ConnInfo = {
  name: string;
  vendor: string;
  jdbcUrl: string;
  driverClassName: string;
  username: string;
  password: string;
};

type TableBookmark = {
  name: string;
  owner: string;
  tableName: string;
  comments?: string;
};

type SqlResult = {
  columnNames: string[];
  result: string[][];
  count: number;
};

type FetchQuery = {
  query: string;
  fetchSize: number;
  sqlResult: SqlResult;
};

type ConnectionState = ConnInfo & {
  setConnInfo: (connInfo: ConnInfo) => void;
};

type TableFilter = {
  owner: string;
  tableName: string;
};

type ColumnFilter = {
  owner: string;
  tableName: string;
  columnName: string;
};
