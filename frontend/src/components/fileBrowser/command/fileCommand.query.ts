import { useMutation, useQueryClient } from "@tanstack/react-query";
import fileCommandApi from "../command/fileCommand.api";

export const useNewFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { path: string; type: string; name: string }): Promise<any> => {
      return fileCommandApi.newFile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};

export const useCopyFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { files: string[]; path: string }): Promise<any> => {
      return fileCommandApi.copyFiles(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};

export const useMoveFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { files: string[]; path: string }): Promise<any> => {
      return fileCommandApi.moveFiles(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { path: string; changeName: string }): Promise<any> => {
      return fileCommandApi.renameFile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};

export const useDeleteFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { files: string[] }): Promise<any> => {
      return fileCommandApi.deleteFiles(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};

const useFileCommandQuery = () => {
  return {
    newFile: useNewFile().mutateAsync,
    copyFiles: useCopyFiles().mutateAsync,
    moveFiles: useMoveFiles().mutateAsync,
    renameFile: useRenameFile().mutateAsync,
    deleteFiles: useDeleteFiles().mutateAsync,
  };
};

export default useFileCommandQuery;
