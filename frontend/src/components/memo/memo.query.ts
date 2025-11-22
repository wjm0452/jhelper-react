import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMemo, getMemoList, saveMemo } from "./memo.api";

export const useGetMemoList = ({ page, size, filter }: SearchMemoType) => {
  return useQuery({
    queryKey: ["memoList", page, size, filter],
    queryFn: (): Promise<PagingResults<Memo>> => getMemoList({ page, size, filter }),
  });
};

export const useSaveMemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memo: Memo): Promise<Memo> => saveMemo(memo),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["memoList"] }),
  });
};

export const useDeleteMemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number): Promise<Memo> => deleteMemo(id),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["memoList"] }),
  });
};
