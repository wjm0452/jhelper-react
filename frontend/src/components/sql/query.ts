import { useQuery } from "@tanstack/react-query";
import { jsqlInstance } from "./api";
import { useConnectionStoreInContext } from "./context";

export const useLoadTemplate = (vendor: string) => {
  return useQuery({
    queryKey: ["sqlTemplate", vendor],
    queryFn: (): Promise<void> => jsqlInstance.loadTemplate(vendor),
    enabled: false,
  });
};

export const useGetTables = (tablelFilter: TableFilter, options?: { enabled: boolean }) => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  return useQuery({
    queryKey: ["tables", name, tablelFilter.owner, tablelFilter.tableName],
    queryFn: (): Promise<SqlResult> => jsqlInstance.findTableInfo(tablelFilter, { name: name }),
    enabled: options?.enabled || false,
  });
};

export const useGetColumns = (columnFilter: ColumnFilter, options?: { enabled: boolean }) => {
  const connectionStore = useConnectionStoreInContext();
  const name = connectionStore.name;

  return useQuery({
    queryKey: ["columns", name, columnFilter.owner, columnFilter.tableName],
    queryFn: (): Promise<SqlResult> => jsqlInstance.findColumnInfo(columnFilter, { name: name }),
    enabled: options?.enabled || false,
  });
};
