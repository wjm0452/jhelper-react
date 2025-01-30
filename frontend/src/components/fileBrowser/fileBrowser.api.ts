import httpClient from "../../common/httpClient";

export const getRootPath = async (): Promise<FileType> => {
  try {
    let res: any = await httpClient.get("/api/file-browser/root-path");
    return res.data;
  } catch (e) {
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
    let res: any = await httpClient.get("/api/file-browser/files", null, {
      params: {
        path,
        ...filter,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
