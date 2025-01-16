import { useRef } from "react";
import ObjectView from "./objectView";
import { ConnectionStoreProvider } from "./sql.context";
import SqlEditor from "./sqlEditor";
import { Splitter, SplitterPanel } from "primereact/splitter";

const SqlApp = () => {
  const sqlEditorRef = useRef<any>();

  return (
    <ConnectionStoreProvider name="sql.connection">
      <Splitter className="h-100">
        <SplitterPanel size={30} className="p-1">
          <ObjectView
            onCommand={({ command, data }: { command: string; data: any }) => {
              sqlEditorRef.current.execCommand(command, data);
            }}
          ></ObjectView>
        </SplitterPanel>
        <SplitterPanel size={70} className="p-1">
          <SqlEditor ref={sqlEditorRef} />
        </SplitterPanel>
      </Splitter>
    </ConnectionStoreProvider>
  );
};

export default SqlApp;
