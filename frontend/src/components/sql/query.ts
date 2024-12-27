import { useQuery } from "@tanstack/react-query";
import { jsqlInstance } from "./api";
import { useGetConnInfoList } from "./connManager/query";
import { useConnectionStore } from "./store";

export const useGetTables = (searchTables: SearchTables) => {
  const connectionStore = useConnectionStore();
  const name = connectionStore.name;

  return useQuery({
    queryKey: ["tables", name],
    queryFn: (): Promise<SqlResult> => jsqlInstance.findTableInfo(searchTables, { name: name }),
    enabled: false,
  });
};

export const useLoadTemplate = (vendor: string) => {
  return useQuery({
    queryKey: ["sqlTemplate", vendor],
    queryFn: (): Promise<void> => jsqlInstance.loadTemplate(vendor),
    enabled: false,
  });
};

export const useGetColumns = (searchColumns: SearchColumns) => {
  const connectionStore = useConnectionStore();
  const name = connectionStore.name;

  return useQuery({
    queryKey: ["columns", name],
    queryFn: (): Promise<SqlResult> => jsqlInstance.findColumnInfo(searchColumns, { name: name }),
    enabled: false,
  });
};
