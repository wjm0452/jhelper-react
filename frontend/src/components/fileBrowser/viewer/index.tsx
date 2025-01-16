import { Button } from "primereact/button";
import TextFileViewer from "./fileViewer.text";
import ImageFileViewer from "./fileViewer.image";
import VideoFileViewer from "./fileViewer.video";
import PdfFileViewer from "./fileViewer.pdf";
import { useEffect, useState } from "react";
import XlsxFileViewer from "./fileViewer.xlsx";
import MarkdownFileViewer from "./fileViewer.markdown";
import { Card } from "primereact/card";
import PptxFileViewer from "./fileViewer.pptx";
import DocxFileViewer from "./fileViewer.docx";

const getFileType = (path: string) => {
  path = path.toLowerCase();
  if (/\S+.json|txt/.test(path)) {
    return "text";
  } else if (/\S+.md/.test(path)) {
    return "md";
  } else if (/\S+.jpg|gif|png/.test(path)) {
    return "image";
  } else if (/\S+.avi|mp4/.test(path)) {
    return "video";
  } else if (/\S+.pdf/.test(path)) {
    return "pdf";
  } else if (/\S+.xlsx/.test(path)) {
    return "xlsx";
  } else if (/\S+.pptx/.test(path)) {
    return "pptx";
  } else if (/\S+.docx/.test(path)) {
    return "docx";
  }
};

const FileViewerWrap = ({
  path,
  show,
  onClose,
}: {
  path: string;
  show: boolean;
  onClose: () => void;
}) => {
  const [filePath, setFilePath] = useState("");
  const [inset, setInset] = useState(10);

  useEffect(() => {
    if (show) {
      setFilePath(path);
    } else {
      setFilePath("");
    }
  }, [show]);

  return (
    <div
      className="position-absolute justify-content-center align-items-center"
      style={{
        inset: `${inset}rem`,
        zIndex: 999,
        display: show ? "" : "none",
        backgroundColor: "white",
      }}
    >
      <div className="d-flex flex-column h-100 modal-content">
        <div className="flex modal-header">
          <div>Viewer - {filePath}</div>
          <div className="justify-content-end">
            <Button
              icon={`pi ${inset == 0 ? "pi-window-minimize" : "pi-window-maximize"}`}
              rounded
              text
              onClick={() => {
                setInset(inset == 10 ? 0 : 10);
              }}
            />
            <Button
              icon="pi pi-times"
              rounded
              text
              onClick={() => {
                onClose();
              }}
            />
          </div>
        </div>
        <div className="flex-grow-1 modal-body overflow-hidden">
          <FileViewer path={filePath}></FileViewer>
        </div>
      </div>
    </div>
  );
};

const FileViewer = ({ path }: { path: string }) => {
  const [fileType, setFileType] = useState("");
  useEffect(() => {
    if (path) {
      setFileType(getFileType(path));
    } else {
      setFileType("");
    }
  }, [path]);

  if (!path) {
    return <div>No file selected.</div>;
  }

  switch (fileType) {
    case "text":
      return <TextFileViewer path={path} />;
    case "md":
      return <MarkdownFileViewer path={path} />;
    case "image":
      return <ImageFileViewer path={path} />;
    case "pdf":
      return <PdfFileViewer path={path} />;
    case "xlsx":
      return <XlsxFileViewer path={path} />;
    case "pptx":
      return <PptxFileViewer path={path} />;
    case "docx":
      return <DocxFileViewer path={path} />;
    case "video":
      return <VideoFileViewer path={path} />;
    default:
      return (
        <div className="flex align-items-center">
          <span className="m-0">연결된 파일 뷰어가 없습니다. 텍스트 문서로 여시 겠습니까?</span>
          <Button
            className="pi pi-file"
            text
            onClick={() => {
              setFileType("text");
            }}
          >
            열기
          </Button>
        </div>
      );
  }
};

export default FileViewerWrap;
