import httpClient from "../../common/httpClient";

const getMemo = async (id: string) => {
  const res = await httpClient.get(`/api/memo/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

const getMemoList = async (page: number, size: number) => {
  const res = await httpClient.get("/api/memo", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

const createMemo = async (obj: { title: string; content: string }) => {
  const res = await httpClient.post("/api/memo", obj);
  return res.data;
};

const updateMemo = async (obj: {
  id: string;
  title: string;
  content: string;
}) => {
  const res = await httpClient.put("/api/memo", obj);
  return res.data;
};

const saveMemo = async (data: any) => {
  const item = data;
  if (!item.title.trim() || !item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateMemo({
      id: item.id,
      title: item.title,
      content: item.content,
    });
  } else {
    item.registerDate = new Date();
    return createMemo({
      title: item.title,
      content: item.content,
    });
  }
};

const deleteMemo = async (id: string) => {
  const res = await httpClient.delete(`/api/memo/${id}`);
  const data = res.data;

  return data;
};

export { getMemo, getMemoList, createMemo, updateMemo, saveMemo, deleteMemo };
