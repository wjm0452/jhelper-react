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
    return await httpClient.post("/api/file-command/new", {
      path,
      type,
      name,
    });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
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
    return await httpClient.post("/api/file-command/copy", { files, path });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
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
    return await httpClient.post("/api/file-command/move", { files, path });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
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
    return await httpClient.post("/api/file-command/rename", { path, changeName });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const deleteFiles = async ({ files }: { files: string[] }): Promise<void> => {
  try {
    return await httpClient.post("/api/file-command/delete", { files });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
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
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
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
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const getFile = async (path: string, options?: any) => {
  try {
    return await httpClient.request({
      method: "get",
      url: "/api/file-command/file",
      responseType: options?.responseType || "blob",
      params: { path: path },
    });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const fileToBoard = async ({ files }: { files: string[] }) => {
  try {
    return await httpClient.post("/api/file-command/board", { files });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const indexingFiles = async ({ files }: { files: string[] }) => {
  try {
    return await httpClient.post("/api/file-index", { files });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const indexingFilesToTerminate = async () => {
  try {
    return await httpClient.post("/api/file-index/terminate");
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const deleteIndexingFiles = async () => {
  try {
    return await httpClient.delete("/api/file-index");
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
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
  fileToBoard,
  indexingFiles,
  indexingFilesToTerminate,
  deleteIndexingFiles,
};

export default fileCommandApi;
