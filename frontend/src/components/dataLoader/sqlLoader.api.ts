import httpClient from "../../common/httpClient";

type LoadDataType = {
  query: string;
  source: { connName: string; owner: string; tableName: string };
  target: { connName: string; owner: string; tableName: string; columns: string[] };
};

export const loadData = async ({ query, source, target }: LoadDataType) => {
  const data = {
    sourceName: source.connName,
    sourceOwner: source.owner,
    sourceTableName: source.tableName,
    sourceQuery: query,
    targetName: target.connName,
    targetOwner: target.owner,
    targetTableName: target.tableName,
    targetColumns: target.columns,
  };

  try {
    await httpClient.post("/api/dataloader/sql", data);
  } catch (e: any) {
    console.error(`[${e.state}] ${e.detail}`);
    throw e;
  }
};
