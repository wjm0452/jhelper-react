import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import boardApi from "./board.api";
import { useMessageStoreInContext } from "../common/message/message.context";

export const useGetBoardList = (searchBoard: SearchBoardType) => {
  return useQuery({
    queryKey: [
      "boardList",
      searchBoard.page,
      searchBoard.size,
      searchBoard.category,
      searchBoard.filter || "",
    ],
    queryFn: (): Promise<PagingResults<Board>> => boardApi.getBoardList(searchBoard),
  });
};

export const useGetBoard = (id: string, options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["board", id],
    queryFn: (): Promise<Board> => boardApi.getBoard(id),
    enabled: options?.enabled || false,
  });
};

export const useSaveBoard = () => {
  const messageStore = useMessageStoreInContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Board): Promise<Board> => boardApi.saveBoard(item),
    onSuccess: (data) => {
      queryClient.setQueryData(["board", data.id], data);
      messageStore.toast("Save", "저장 되었습니다.");
    },
  });
};

export const useDeleteBoard = () => {
  const messageStore = useMessageStoreInContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<Board> => boardApi.deleteBoard(id),
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["board", data.id] });
      messageStore.toast("Delete", "삭제 되었습니다.");
    },
  });
};

export const useDeleteBoards = () => {
  const messageStore = useMessageStoreInContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string[]): Promise<Board[]> => boardApi.deleteBoards(id),
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["boardList"] });
      messageStore.toast("Delete", "삭제 되었습니다.");
    },
  });
};
