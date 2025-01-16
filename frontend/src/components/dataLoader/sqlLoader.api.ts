import httpClient from "../../common/httpClient";

type LoadDataType = {
  query: string;
  source: { name: string; owner: string; tableName: string };
  target: { name: string; owner: string; tableName: string; columns: string[] };
};

export const loadData = async ({ query, source, target }: LoadDataType) => {
  const data = {
    sourceName: source.name,
    sourceOwner: source.owner,
    sourceTableName: source.tableName,
    sourceQuery: query,
    targetName: target.name,
    targetOwner: target.owner,
    targetTableName: target.tableName,
    targetColumns: target.columns,
  };

  await httpClient.post("/api/dataloader", data);
};
