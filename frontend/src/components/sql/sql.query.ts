import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import sqlApi from "./sql.api";
import { useConnectionStoreInContext } from "./sql.context";

export const useGetTables = (
  tablelFilter: TableFilter,
  options: { enabled: boolean } = { enabled: true },
): UseQueryResult<SqlResult, Error> => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  const enabled = !!(name && tablelFilter.owner && options.enabled);

  return useQuery({
    queryKey: ["tables", name, tablelFilter],
    queryFn: (): Promise<SqlResult> => sqlApi.findTables(tablelFilter, connectionStore),
    enabled: enabled,
  });
};

export const useGetColumns = (
  columnFilter: ColumnFilter,
  options: { enabled: boolean } = { enabled: true },
): UseQueryResult<SqlResult, Error> => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  const enabled = !!(name && columnFilter.owner && options.enabled);

  return useQuery({
    queryKey: ["columns", name, columnFilter],
    queryFn: (): Promise<SqlResult> => sqlApi.findColumns(columnFilter, connectionStore),
    enabled: enabled,
  });
};

export const useGetIndexes = (
  tablelFilter: TableFilter,
  options: { enabled: boolean } = { enabled: true },
) => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  const enabled = !!(name && tablelFilter.owner && options.enabled);

  return useQuery({
    queryKey: ["indexes", name, tablelFilter],
    queryFn: (): Promise<SqlResult> => sqlApi.findIndexes(tablelFilter, connectionStore),
    enabled: enabled,
  });
};

export const useGetTableBookmarks = (
  tablelFilter: TableFilter,
  options: { enabled: boolean } = { enabled: true },
) => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  const enabled = !!(name && tablelFilter.owner && options.enabled);

  return useQuery({
    queryKey: ["tableBookmarks", name, tablelFilter],
    queryFn: (): Promise<TableBookmark[]> =>
      sqlApi.findTableBookmark({
        name,
        owner: tablelFilter.owner,
        tableName: tablelFilter.tableName,
      }),
    enabled: enabled,
  });
};

export const useSaveTableBookmark = () => {
  const queryClient = useQueryClient();
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  return useMutation({
    mutationFn: ({
      owner,
      tableName,
      comments,
    }: {
      owner: string;
      tableName: string;
      comments: string;
    }): Promise<TableBookmark> => sqlApi.saveTableBookmark({ name, owner, tableName, comments }),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["tableBookmarks"] }),
  });
};

export const useDeleteTableBookmark = () => {
  const queryClient = useQueryClient();
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  return useMutation({
    mutationFn: ({ owner, tableName }: { owner: string; tableName: string }): Promise<void> =>
      sqlApi.deleteTableBookmark({ name, owner, tableName }),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["tableBookmarks"] }),
  });
};
