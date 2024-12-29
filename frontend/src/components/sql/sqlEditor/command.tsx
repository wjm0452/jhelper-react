import { runSql } from "../api";
import { useConnectionStoreInContext } from "../context";
import { useCommandQueryStore } from "../store";
import editorUtils from "./editorUtils";

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
        const sqlResult = await runSql(query, {
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
          await editorUtils.makeSelectQuery({
            ...data,
            name: connectionStore.name,
          }),
        );
      } else if ("addInsertQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await editorUtils.makeInsertQuery({
            ...data,
            name: connectionStore.name,
          }),
        );
      } else if ("addUpdateQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await editorUtils.makeUpdateQuery({
            ...data,
            name: connectionStore.name,
          }),
        );
      } else if ("addDeleteQuery" == command) {
        editorRef.current.addTextToFirstLine(
          await editorUtils.makeDeleteQuery({
            ...data,
            name: connectionStore.name,
          }),
        );
      }
    },
  };

  return module;
};

export default Command;
