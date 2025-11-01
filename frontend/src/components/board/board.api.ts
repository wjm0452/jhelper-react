import httpClient from "../../common/httpClient";

export const getBoardList = async ({
  category,
  registerId,
  from,
  to,
  filter,
  page,
  size,
}: SearchBoardType): Promise<PagingResults<Board>> => {
  try {
    return await httpClient.get("/api/board", null, {
      params: {
        category,
        registerId,
        from,
        to,
        filter,
        page,
        size,
      },
    });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const getBoard = async (id: number): Promise<Board> => {
  if (!id) {
    return {} as Board;
  }

  try {
    const data = await httpClient.get(`/api/board/${id}`);

    if (data.registerDate) {
      data.registerDate = data.registerDate.slice(0, 16);
    }

    return data;
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const createBoard = async (item: Board): Promise<Board> => {
  try {
    return await httpClient.post("/api/board", item);
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const updateBoard = async (item: Board): Promise<Board> => {
  try {
    return await httpClient.put("/api/board", item);
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const saveBoard = async (item: Board): Promise<Board> => {
  if (!item.title.trim() || !item.content.trim()) {
    return;
  }

  if (item.id) {
    return updateBoard({
      id: item.id,
      category: item.category,
      title: item.title,
      content: item.content,
    } as Board);
  } else {
    item.registerDate = new Date().toISOString().slice(0, 16);
    return createBoard({
      category: item.category,
      title: item.title,
      content: item.content,
    } as Board);
  }
};

export const deleteBoard = async (id: number): Promise<Board> => {
  try {
    return await httpClient.delete(`/api/board/${id}`);
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export const deleteBoards = async (ids: number[]): Promise<Board[]> => {
  try {
    return await httpClient.delete(`/api/board`, { ids });
  } catch (e: any) {
    alert(`[${e.state}] ${e.detail}`);
    throw e;
  }
};

export default {
  getBoardList,
  getBoard,
  createBoard,
  updateBoard,
  saveBoard,
  deleteBoard,
  deleteBoards,
};
