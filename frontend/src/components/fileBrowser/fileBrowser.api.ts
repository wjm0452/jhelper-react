import httpClient from "../../common/httpClient";

export const getRootPath = async (): Promise<FileType> => {
  try {
    return await httpClient.get("/api/file-browser/root-path");
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const getFileList = async ({
  path,
  filter,
}: {
  path: string;
  filter?: FileBrowserFilterType;
}): Promise<FileType[]> => {
  try {
    return await httpClient.get("/api/file-browser/files", null, {
      params: {
        path,
        ...filter,
      },
    });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};
