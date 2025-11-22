import httpClient from "../../common/httpClient";

export const readExcel = async ({ uploadedPath }: { uploadedPath: string }) => {
  try {
    return httpClient.get(
      "/api/dataloader/excel/read-file",
      {},
      {
        params: {
          path: uploadedPath,
        },
      },
    );
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

type LoadExcelDataType = {
  path: string;
  startRow: number;
  startCol: number;
  queryParams: string;
  target: { connName: string; owner: string; tableName: string; columns: string[] };
};

export const loadExcelData = async ({ path, startRow, startCol, queryParams, target }: LoadExcelDataType) => {
  const data = {
    path,
    startRow,
    startCol,
    queryParams,
    targetName: target.connName,
    targetOwner: target.owner,
    targetTableName: target.tableName,
    targetColumns: target.columns,
  };
  try {
    await httpClient.post("/api/dataloader/excel/load", data);
  } catch (e: any) {
    console.error(`[${e.state}] ${e.detail}`);
    throw e;
  }
};
