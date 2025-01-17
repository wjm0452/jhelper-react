import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import TableView from "../../common/tableViewer";
import { useConnectionStoreInContext } from "../sql.context";
import { useCommandQueryStore } from "../sql.store";
import Command from "./command";
import CommandToolbar from "./command.toolbar";
import Editor from "./editor";
import { useSqlEditorState } from "./sqlEditor.store";
import { Splitter, SplitterPanel } from "primereact/splitter";

type SqlResultViewProps = {
  sqlState: string;
  errorMessage: string;
  sqlResult: SqlResult;
};

const SqlResultView = ({ sqlState, errorMessage, sqlResult }: SqlResultViewProps) => {
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
        <div>{sqlState}</div>
        <div>{errorMessage}</div>
      </div>
    );
  }

  return <TableView header={sqlResult?.columnNames} data={sqlResult?.result}></TableView>;
};

const SqlEditor = forwardRef((props, ref) => {
  const editorRef = useRef<Editor>();
  const sqlEditorStore = useSqlEditorState();
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

  useEffect(() => {
    editorRef.current.setValue(sqlEditorStore.value);
  }, []);

  return (
    <>
      <Splitter
        layout="vertical"
        className="w-100 h-100"
        stateStorage="session"
        stateKey="sqlEditor.splitter"
      >
        <SplitterPanel className="flex flex-column" size={70}>
          <CommandToolbar onCommand={execCommand} />
          <div className="flex-grow-1 mt-1">
            <Editor
              ref={editorRef}
              onEnter={() => {
                sqlEditorStore.setValue(editorRef.current.getValue()); // cache
                commandExecutor.executeSql();
              }}
            ></Editor>
          </div>
        </SplitterPanel>
        <SplitterPanel className="overflow-hidden flex flex-column" size={30}>
          <div className="h-100 overflow-auto">
            <SqlResultView
              sqlState={commandQueryStore.sqlState}
              errorMessage={commandQueryStore.errorMessage}
              sqlResult={commandQueryStore.sqlResult}
            />
          </div>{" "}
          <div>
            <span>{commandQueryStore.sqlResult?.count}</span> fetched rows
          </div>
        </SplitterPanel>
      </Splitter>
    </>
  );
});

export default SqlEditor;
