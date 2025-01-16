import httpClient from "../../../common/httpClient";

export const newFile = async ({
  path,
  type,
  name,
}: {
  path: string;
  type: string;
  name: string;
}): Promise<void> => {
  try {
    let res: any = await httpClient.post("/api/file-command/new", {
      path,
      type,
      name,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const copyFiles = async ({
  files,
  path,
}: {
  files: string[];
  path: string;
}): Promise<void> => {
  try {
    let res: any = await httpClient.post("/api/file-command/copy", { files, path });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const moveFiles = async ({
  files,
  path,
}: {
  files: string[];
  path: string;
}): Promise<void> => {
  try {
    let res: any = await httpClient.post("/api/file-command/move", { files, path });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const renameFile = async ({
  path,
  changeName,
}: {
  path: string;
  changeName: string;
}): Promise<void> => {
  try {
    let res: any = await httpClient.post("/api/file-command/rename", { path, changeName });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteFiles = async ({ files }: { files: string[] }): Promise<void> => {
  try {
    let res: any = await httpClient.post("/api/file-command/delete", { files });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const downloadFiles = async ({ files }: { files: string[] }): Promise<void> => {
  try {
    await httpClient.downloadFile({
      method: "post",
      url: "/api/file-command/download",
      responseType: "blob",
      data: { files },
    });
  } catch (e) {
    throw e;
  }
};

export const exportFiles = async ({ files }: { files: string[] }): Promise<void> => {
  try {
    await httpClient.downloadFile(
      {
        method: "post",
        url: "/api/file-command/export",
        responseType: "blob",
        data: { files },
      },
      { fileName: "files.xlsx" },
    );
  } catch (e) {
    throw e;
  }
};

export const getFile = async (path: string, options?: any) => {
  const res = await httpClient.request({
    method: "get",
    url: "/api/file-command/file",
    responseType: options?.responseType || "blob",
    params: { path: path },
  });

  return res.data;
};

const fileCommandApi = {
  newFile,
  copyFiles,
  moveFiles,
  renameFile,
  deleteFiles,
  downloadFiles,
  exportFiles,
  getFile,
};

export default fileCommandApi;
