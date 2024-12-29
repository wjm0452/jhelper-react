import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TableView from "../../common/tableViewer";
import { runSql } from "../api";
import Editor from "./editor";
import editorUtils from "./editorUtils";
import { useConnectionStoreInContext } from "../context";
import CommandTool from "./commandTool";
import { useCommandQueryStore } from "../store";
import Command from "./command";

type SqlResultViewProps = {
  sqlState: string;
  errorMessage: string;
  sqlResult: SqlResult;
};

const SqlResultView = ({ sqlState, errorMessage, sqlResult }: SqlResultViewProps) => {
  const commandQueryStore = useCommandQueryStore();

  if (sqlState) {
    return (
      <div
        style={{
          display: sqlState ? "" : "none",
          height: "95%",
          backgroundColor: "grey",
          padding: "5px",
          fontWeight: "bold",
        }}
      >
        <div>{commandQueryStore.sqlState}</div>
        <div>{commandQueryStore.errorMessage}</div>
      </div>
    );
  }

  return <TableView header={sqlResult?.columnNames} data={sqlResult?.result}></TableView>;
};

const SqlEditor = forwardRef((props, ref) => {
  const editorRef = useRef<Editor>();
  const connectionStore = useConnectionStoreInContext();
  const commandQueryStore = useCommandQueryStore();

  const commandExecutor = Command(editorRef);

  const execCommand = async (command: string, data: any) => {
    commandExecutor.command(command, data);
  };

  useImperativeHandle(
    ref,
    () => ({
      execCommand,
    }),
    [connectionStore],
  );

  return (
    <div className="d-flex flex-column h-100 p-2">
      <CommandTool onCommand={execCommand} />
      <div className="flex-grow-1 mt-1">
        <Editor ref={editorRef} onEnter={() => commandExecutor.executeSql()}></Editor>
      </div>
      <div className="mt-1 overflow-auto" style={{ height: "350px" }}>
        <SqlResultView
          sqlState={commandQueryStore.sqlState}
          errorMessage={commandQueryStore.errorMessage}
          sqlResult={commandQueryStore.sqlResult}
        />
      </div>
      <div>
        <div className="d-inline-block">
          <span>{commandQueryStore.sqlResult?.count}</span> fetched rows
        </div>
        {/* <div className="float-end">
          <ExportButtons query={query} />
        </div> */}
      </div>
    </div>
  );
});

export default SqlEditor;
