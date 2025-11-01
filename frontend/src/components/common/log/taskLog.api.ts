import httpClient from "../../../common/httpClient";

export const getTaskLog = async ({ id, start = 0 }: { id: number; start?: number }) => {
  return await httpClient.get("/api/task-logs", {}, { params: { id, start } });
};

const taskLogApi = {
  getTaskLog,
};

export default taskLogApi;
