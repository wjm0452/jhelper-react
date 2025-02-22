import { Button } from "primereact/button";
import { useState } from "react";
import { uploadFile } from "./uploader.api";
import { useMessageStoreInContext } from "../message/message.context";

type MultiUploaderProps = {
  uploadUrl: string;
  accept?: string;
  params?: any;
  onUpload?: (data: any) => void;
};

const fileSize = (size: number) => {
  const SIZE_UNIT = ["Bytes", "KB", "MB", "GB"];
  let fileSize = size;
  let sizeUnit = "";
  for (sizeUnit of SIZE_UNIT) {
    if (fileSize < 1024) {
      break;
    }

    fileSize /= 1024;
  }

  return `${parseFloat(fileSize.toFixed(2))} ${sizeUnit}`;
};

const fileExtension = (fileName: string) => {
  if (fileName.lastIndexOf(".") == -1) {
    return "N/A";
  }
  return fileName.substring(fileName.lastIndexOf(".") + 1);
};

const MultiUploader = ({ uploadUrl, params, onUpload, accept }: MultiUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const messageStore = useMessageStoreInContext();

  const upload = async () => {
    if (!files.length) {
      messageStore.alert("파일을 선택하세요.", { header: "선택된 파일 없음" });
      return;
    }

    if (
      !(await messageStore.confirm("업로드 하시겠습니까?", {
        header: "Upload",
        icon: "pi-upload",
      }))
    ) {
      return;
    }

    try {
      const uploadResults = await Promise.all(
        files.map((file) => uploadFile({ file, params, uploadUrl })),
      );
      onUpload && onUpload(uploadResults);
      setFiles([]);
    } catch (message) {
      window.alert(message);
    }
  };

  const addFile = (newFiles: FileList) => {
    setFiles([...files, ...Array.from(newFiles)]);
  };

  return (
    <div>
      <div className="flex">
        <div className="flex align-items-center">
          <input
            type="file"
            multiple={true}
            accept={accept}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              addFile(e.currentTarget.files);
              e.currentTarget.value = null;
            }}
          />
        </div>
        <div className="ml-auto">
          <Button icon="pi pi-upload" aria-label="upload" onClick={(e) => upload()} />
        </div>
      </div>
      <div>
        {files.map((file, i) => (
          <div key={file.name}>
            <div className="d-flex">
              <div className="d-flex align-items-center">
                <span className="ml-3">{fileExtension(file.name)}</span>
                <span className="ml-3">{file.name}</span>
                <span className="ml-3">{fileSize(file.size)}</span>
              </div>
              <div className="ml-auto">
                <Button
                  icon="pi pi-times"
                  rounded
                  text
                  severity="danger"
                  aria-label="Delete"
                  onClick={() => {
                    files.splice(i, 1);
                    setFiles([...files]);
                  }}
                />
              </div>
            </div>
            <div className="cb-file-progress">
              <span className="cb-file-progress-inc"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiUploader;
