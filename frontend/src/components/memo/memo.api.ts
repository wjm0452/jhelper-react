import httpClient from "../../common/httpClient";

export const getMemo = async (id: string): Promise<Memo> => {
  const res = await httpClient.get(`/api/memo/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

export const getMemoList = async (page: number, size: number): Promise<PagingResults<Memo>> => {
  const res = await httpClient.get("/api/memo", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

export const createMemo = async (obj: { content: string }): Promise<Memo> => {
  const res = await httpClient.post("/api/memo", obj);
  return res.data;
};

export const updateMemo = async (obj: { id: string; content: string }): Promise<Memo> => {
  const res = await httpClient.put("/api/memo", obj);
  return res.data;
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
  const res = await httpClient.delete(`/api/memo/${id}`);
  const data = res.data;

  return data;
};

export default { getMemo, getMemoList, createMemo, updateMemo, saveMemo, deleteMemo };
