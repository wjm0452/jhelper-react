import httpClient from "../../../common/httpClient";

export const getJobLog = async ({ id, start = 0 }: { id: number; start?: number }) => {
  try {
    let res: any = await httpClient.get("/api/job-log", {}, { params: { id, start } });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const jobLogApi = {
  getJobLog,
};

export default jobLogApi;
