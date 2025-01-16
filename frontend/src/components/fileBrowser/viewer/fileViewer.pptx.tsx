import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";
import httpClient from "../../../common/httpClient";

const PptxFileViewer = ({ path }: { path: string }) => {
  const [outputHtml, setOutputHtml] = useState("");

  const getFile = async (path: string) => {
    const res: any = await httpClient.get(`/api/file-viewer/pptx?path=${encodeURIComponent(path)}`);
    setOutputHtml(res.data);
  };

  useEffect(() => {
    if (path) {
      getFile(path);
    }
  }, [path]);

  return (
    <div className="h-100 overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: outputHtml }}></div>
    </div>
  );
};

export default PptxFileViewer;
