import httpClient from "../../../common/httpClient";

export const getConnInfoList = async (): Promise<ConnInfo[]> => {
  const res = await httpClient.get(`/api/conn-info`);
  const data = res.data;

  return data;
};

export const saveConnInfo = async (obj: ConnInfo): Promise<ConnInfo> => {
  const res = await httpClient.put("/api/conn-info", obj);
  return res.data;
};

export const deleteConnInfo = async (name: string): Promise<ConnInfo> => {
  const res = await httpClient.delete(`/api/conn-info/${name}`);
  return res.data;
};

export default { getConnInfoList, saveConnInfo, deleteConnInfo };
