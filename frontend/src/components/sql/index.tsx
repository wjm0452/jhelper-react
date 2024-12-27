import ConnManager from "./connManager";
import SqlEditor from "./sqlEditor";
import ObjectView from "./objectView";
import { useRef } from "react";

const SqlApp = () => {
  const sqlEditorRef = useRef<any>();

  return (
    <>
      <ConnManager></ConnManager>
      <div className="w-100 h-100 d-flex flex-row">
        <div className="flex-grow-0 flex-shrink-1" style={{ maxWidth: "500px", minWidth: "500px" }}>
          <ObjectView
            onCommand={({ command, data }: { command: string; data: any }) => {
              sqlEditorRef.current.execCommand(command, data);
            }}
          ></ObjectView>
        </div>
        <div className="flex-grow-1 flex-shrink-1" style={{ minWidth: "500px" }}>
          <SqlEditor ref={sqlEditorRef}></SqlEditor>
        </div>
      </div>
    </>
  );
};

export default SqlApp;
