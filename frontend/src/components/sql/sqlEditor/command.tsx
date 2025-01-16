import httpClient from "../../../common/httpClient";
import { useConnectionStoreInContext } from "../sql.context";
import { useCommandQueryStore } from "../sql.store";
import sqlApi from "../sql.api";

const exportTo = (
  {
    type,
    query,
    fileName,
  }: {
    type: string;
    query: string;
    fileName: string;
  },
  { name }: { name: string },
) => {
  if (!query || !query.toLowerCase().startsWith("select")) {
    alert("조회 후 사용해 주세요.");
    return;
  }

  httpClient.downloadFile(
    {
      method: "post",
      url: `/api/sql-export/${type}`,
      responseType: "blob",
      data: { query: query, name: name },
    },
    { fileName },
  );
};

const Command = (editorRef: any) => {
  const connectionStore = useConnectionStoreInContext();
  const commandQueryStore = useCommandQueryStore();

  const module = {
    // sql execute
    executeSql: async () => {
      editorRef.current.setRangeAtCursorPos();
      const query = editorRef.current.getValueAtCursorPos();

      commandQueryStore.resetQuery();
      commandQueryStore.setQuery(query);
      try {
        const sqlResult = await sqlApi.runSql(query, {
          name: connectionStore.name,
          fetchSize: commandQueryStore.fetchSize,
        });
        commandQueryStore.setSqlResult(sqlResult);
      } catch (e: any) {
        commandQueryStore.setSqlState(e.sqlState);
        commandQueryStore.setErrorMessage(e.errorMessage);
      }
    },

    command: async (command: string, data: any) => {
      if (command == "executeQuery") {
        editorRef.current.focus();
        await module.executeSql();
      } else if (command == "clear") {
        editorRef.current.reset();
        editorRef.current.focus();
      } else if (command == "fetchSize") {
        commandQueryStore.setFetchSize(data);
      } else if ("addSelectQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeSelectQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addInsertQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeInsertQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addUpdateQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeUpdateQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addDeleteQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeDeleteQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("exportExcel" == command) {
        exportTo(
          {
            type: "excel",
            query: commandQueryStore.query,
            fileName: "sql_result.xlsx",
          },
          connectionStore,
        );
      } else if ("exportText" == command) {
        exportTo(
          {
            type: "text",
            query: commandQueryStore.query,
            fileName: "sql_result.txt",
          },
          connectionStore,
        );
      } else if ("exportJson" == command) {
        exportTo(
          {
            type: "json",
            query: commandQueryStore.query,
            fileName: "sql_result.json",
          },
          connectionStore,
        );
      }
    },
  };

  return module;
};

export default Command;
