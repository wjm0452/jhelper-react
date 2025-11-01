import httpClient from "../../../common/httpClient";

export const getConnInfoList = async (): Promise<ConnInfo[]> => {
  return await httpClient.get(`/api/conn-info`);
};

export const saveConnInfo = async (obj: ConnInfo): Promise<ConnInfo> => {
  return await httpClient.put("/api/conn-info", obj);
};

export const deleteConnInfo = async (name: string): Promise<ConnInfo> => {
  return await httpClient.delete(`/api/conn-info/${name}`);
};

export default { getConnInfoList, saveConnInfo, deleteConnInfo };
