import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import connManagerApi from "./connManager.api";

export const useGetConnInfoList = () => {
  return useQuery({
    queryKey: ["connInfoList"],
    queryFn: (): Promise<ConnInfo[]> => connManagerApi.getConnInfoList(),
  });
};

export const useSaveConnInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: ConnInfo): Promise<ConnInfo> => connManagerApi.saveConnInfo(item),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["connInfoList"] }),
  });
};

export const useDeleteConnInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string): Promise<ConnInfo> => connManagerApi.deleteConnInfo(name),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["connInfoList"] }),
  });
};
