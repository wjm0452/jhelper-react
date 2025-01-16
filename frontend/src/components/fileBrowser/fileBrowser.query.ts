import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFileList, getRootPath } from "./fileBrowser.api";

export const useGetFileRoot = () => {
  return useQuery({
    queryKey: ["rootFile"],
    queryFn: (): Promise<FileType> => {
      return getRootPath();
    },
  });
};

export const useGetFileList = (
  {
    path,
    filter,
  }: {
    path: string;
    filter?: FileBrowserFilterType;
  },
  options?: { enabled: boolean },
) => {
  return useQuery({
    queryKey: ["fileList", path, filter],
    queryFn: (): Promise<FileType[]> => getFileList({ path, filter }),
    enabled: path && options?.enabled == undefined ? true : false,
  });
};
