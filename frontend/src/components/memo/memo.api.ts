import httpClient from "../../common/httpClient";

export const getMemo = async (id: string): Promise<Memo> => {
  const data = await httpClient.get(`/api/memo/${id}`);

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

export const getMemoList = async (obj: SearchMemoType): Promise<PagingResults<Memo>> => {
  return await httpClient.get("/api/memo", null, {
    params: obj,
  });
};

export const createMemo = async (obj: { content: string }): Promise<Memo> => {
  return await httpClient.post("/api/memo", obj);
};

export const updateMemo = async (obj: { id: string; content: string }): Promise<Memo> => {
  return await httpClient.put("/api/memo", obj);
};

export const saveMemo = async (data: any): Promise<Memo> => {
  const item = data;
  if (!item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateMemo({
      id: item.id,
      content: item.content,
    });
  } else {
    item.registerDate = new Date();
    return createMemo({
      content: item.content,
    });
  }
};

export const deleteMemo = async (id: number): Promise<Memo> => {
  return await httpClient.delete(`/api/memo/${id}`);
};

export default { getMemo, getMemoList, createMemo, updateMemo, saveMemo, deleteMemo };
