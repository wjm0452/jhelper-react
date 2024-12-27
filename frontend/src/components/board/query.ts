import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import boardApi from "./api";

export const useGetBoardList = ({ page, pageSize }: SearchBoards) => {
  return useQuery({
    queryKey: ["boardList", page, pageSize],
    queryFn: (): Promise<SearchBoardsResults> =>
      boardApi.getBoardList(page, pageSize),
  });
};

export const useGetBoard = (id: string) => {
  return useQuery({
    queryKey: ["board", id],
    queryFn: (): Promise<Board> => boardApi.getBoard(id),
    initialData: (): Board => ({} as Board),
  });
};

export const useSaveBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Board): Promise<Board> => boardApi.saveBoard(item),
    onSuccess: (data) => queryClient.setQueryData(["board", data.id], data),
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<Board> => boardApi.deleteBoard(id),
    onSuccess: (data) =>
      queryClient.removeQueries({ queryKey: ["board", data.id] }),
  });
};
