import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import boardApi from "./board.api";

export const useGetBoardList = ({ filter, page, size }: SearchBoardType) => {
  return useQuery({
    queryKey: ["boardList", page, size, filter],
    queryFn: (): Promise<PagingResults<Board>> => boardApi.getBoardList({ filter, page, size }),
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
    onSuccess: (data) => queryClient.removeQueries({ queryKey: ["board", data.id] }),
  });
};
