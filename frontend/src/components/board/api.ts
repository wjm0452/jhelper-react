import httpClient from "../../common/httpClient";

export const getBoardList = async (
  page: number,
  size: number
): Promise<SearchBoardsResults> => {
  const res = await httpClient.get("/api/board", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

export const getBoard = async (id: string): Promise<Board> => {
  if (!id) {
    return {} as Board;
  }

  const res = await httpClient.get(`/api/board/${id}`);
  const data = res.data;

  if (data.registerDate) {
    data.registerDate = data.registerDate.slice(0, 16);
  }

  return data;
};

export const createBoard = async (item: Board): Promise<Board> => {
  const res = await httpClient.post("/api/board", item);
  return res.data;
};

export const updateBoard = async (item: Board): Promise<Board> => {
  const res = await httpClient.put("/api/board", item);
  console.log(res.data);
  return res.data;
};

export const saveBoard = async (item: Board): Promise<Board> => {
  if (!item.title.trim() || !item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateBoard({
      id: item.id,
      title: item.title,
      content: item.content,
    } as Board);
  } else {
    item.registerDate = new Date().toISOString().slice(0, 16);
    return createBoard({
      title: item.title,
      content: item.content,
    } as Board);
  }
};

export const deleteBoard = async (id: string): Promise<Board> => {
  const res = await httpClient.delete(`/api/board/${id}`);
  const data = res.data;

  return data;
};

export default {
  getBoardList,
  getBoard,
  createBoard,
  updateBoard,
  saveBoard,
  deleteBoard,
};
