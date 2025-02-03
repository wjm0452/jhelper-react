import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import DocxFileViewer from "./fileViewer.docx";
import ImageFileViewer from "./fileViewer.image";
import MarkdownFileViewer from "./fileViewer.markdown";
import PdfFileViewer from "./fileViewer.pdf";
import PptxFileViewer from "./fileViewer.pptx";
import SourceFileViewer from "./fileViewer.source";
import TextFileViewer from "./fileViewer.text";
import VideoFileViewer from "./fileViewer.video";
import XlsxFileViewer from "./fileViewer.xlsx";

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
  } else if (/\S+.java|js|jsx|ts|tsx|css|html|jsp|sql/.test(path)) {
    return "source";
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

  useEffect(() => {
    if (show) {
      setFilePath(path);
    } else {
      setFilePath("");
    }
  }, [show]);

  return (
    <Dialog
      visible={show}
      onHide={() => {
        onClose();
      }}
      position="center"
      header={`Viewer - ${path}`}
      maximizable
      style={{ width: "70vw", height: "70vh" }}
    >
      <FileViewer path={filePath}></FileViewer>
    </Dialog>
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
    case "source":
      return <SourceFileViewer path={path} />;
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
