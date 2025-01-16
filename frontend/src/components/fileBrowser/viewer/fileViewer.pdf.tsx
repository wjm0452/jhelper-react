import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";

const PdfFileViewer = ({ path }: { path: string }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (path) {
      setSrc(`/api/file-viewer/pdf?path=${encodeURIComponent(path)}`);
    } else {
      setSrc("");
    }
  }, []);

  return (
    <div className="h-100">
      <object data={src} type="application/pdf" style={{ width: "100%", height: "100%" }}></object>
    </div>
  );
};

export default PdfFileViewer;
