import httpClient from "../../common/httpClient";

const getQna = async (id: string) => {
  const res = await httpClient.get(`/api/qna/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

const getQnaList = async (page: number, size: number) => {
  const res = await httpClient.get("/api/qna", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

const createQna = async (obj: { title: string; content: string }) => {
  const res = await httpClient.post("/api/qna", obj);
  return res.data;
};

const updateQna = async (obj: {
  id: string;
  title: string;
  content: string;
}) => {
  const res = await httpClient.put("/api/qna", obj);
  return res.data;
};

const saveQna = async (data: any) => {
  const item = data;
  if (!item.title.trim() || !item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateQna({
      id: item.id,
      title: item.title,
      content: item.content,
    });
  } else {
    item.registerDate = new Date();
    return createQna({
      title: item.title,
      content: item.content,
    });
  }
};

const deleteQna = async (id: string) => {
  const res = await httpClient.delete(`/api/qna/${id}`);
  const data = res.data;

  return data;
};

export { getQna, getQnaList, createQna, updateQna, saveQna, deleteQna };
