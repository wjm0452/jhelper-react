import httpClient from "../../../common/httpClient";
import { useConnectionStoreInContext } from "../sql.context";
import { useCommandQueryStore } from "../sql.store";
import sqlApi from "../sql.api";
import { useMessageStoreInContext } from "../../common/message/message.context";

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
  const messageStore = useMessageStoreInContext();

  const module = {
    // sql execute
    executeSql: async () => {
      editorRef.current.setRangeAtCursorPos();
      const query = editorRef.current.getValueAtCursorPos();

      if (!query) {
        messageStore.toast("Run", "실행할 쿼리가 없습니다..", { severity: "warn" });
        return;
      }

      commandQueryStore.resetQuery();
      commandQueryStore.setQuery(query);
      try {
        const sqlResult = await sqlApi.runSql(query, {
          name: connectionStore.name,
          fetchSize: commandQueryStore.fetchSize,
        });
        commandQueryStore.setSqlResult(sqlResult);
      } catch (e: any) {
        commandQueryStore.setState(e.state);
        commandQueryStore.setDetail(e.detail);
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
        if (!data.owner || !data.tableName) {
          messageStore.toast("Command", "owner, tableName을 입력해주세요.", { severity: "warn" });
          return;
        }
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeSelectQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addInsertQuery" == command) {
        if (!data.owner || !data.tableName) {
          messageStore.toast("Command", "owner, tableName을 입력해주세요.", { severity: "warn" });
          return;
        }
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeInsertQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addUpdateQuery" == command) {
        if (!data.owner || !data.tableName) {
          messageStore.toast("Command", "owner, tableName을 입력해주세요.", { severity: "warn" });
          return;
        }
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeUpdateQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("addDeleteQuery" == command) {
        if (!data.owner || !data.tableName) {
          messageStore.toast("Command", "owner, tableName을 입력해주세요.", { severity: "warn" });
          return;
        }
        editorRef.current.addTextToFirstLine(
          await sqlApi.makeDeleteQuery(
            {
              ...data,
            },
            connectionStore,
          ),
        );
      } else if ("exportExcel" == command) {
        if (!commandQueryStore.query) {
          messageStore.toast("Export", "실행할 쿼리가 없습니다.", { severity: "warn" });
          return;
        }
        exportTo(
          {
            type: "excel",
            query: commandQueryStore.query,
            fileName: "sql_result.xlsx",
          },
          connectionStore,
        );
      } else if ("exportText" == command) {
        if (!commandQueryStore.query) {
          messageStore.toast("Export", "실행할 쿼리가 없습니다.", { severity: "warn" });
          return;
        }

        exportTo(
          {
            type: "text",
            query: commandQueryStore.query,
            fileName: "sql_result.txt",
          },
          connectionStore,
        );
      } else if ("exportJson" == command) {
        if (!commandQueryStore.query) {
          messageStore.toast("Export", "실행할 쿼리가 없습니다.", { severity: "warn" });
          return;
        }

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
