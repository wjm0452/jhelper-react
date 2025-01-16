import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";

const MarkdownFileViewer = ({ path }: { path: string }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const data = await fileCommandApi.getFile(path, { responseType: "text/plain" });
      setText(data);
    })();
  });

  return (
    <div className="h-100">
      <textarea className="w-100 h-100 form-control" value={text}></textarea>
    </div>
  );
};

export default MarkdownFileViewer;
