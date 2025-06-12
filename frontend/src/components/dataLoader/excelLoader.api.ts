import httpClient from "../../common/httpClient";

export const readExcel = async ({ uploadedPath }: { uploadedPath: string }) => {
  return httpClient
    .get(
      "/api/dataloader/excel-file",
      {},
      {
        params: {
          path: uploadedPath,
        },
      },
    )
    .then((res) => res.data);
};

type LoadExcelDataType = {
  path: string;
  startRow: number;
  startCol: number;
  queryParams: string;
  target: { name: string; owner: string; tableName: string; columns: string[] };
};

export const loadExcelData = async ({
  path,
  startRow,
  startCol,
  queryParams,
  target,
}: LoadExcelDataType) => {
  const data = {
    path,
    startRow,
    startCol,
    queryParams,
    targetName: target.name,
    targetOwner: target.owner,
    targetTableName: target.tableName,
    targetColumns: target.columns,
  };

  await httpClient.post("/api/dataloader/excel", data);
};
