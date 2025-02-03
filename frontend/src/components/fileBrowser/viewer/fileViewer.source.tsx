import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";

const SourceFileViewer = ({ path }: { path: string }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const data = await fileCommandApi.getFile(path, { responseType: "text" });
      setText(data);
    })();
  }, [path]);

  return (
    <div className="h-100">
      <textarea
        className="w-100 h-100 form-control"
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
        }}
        spellCheck={false}
      ></textarea>
    </div>
  );
};

export default SourceFileViewer;
