import { Button } from "primereact/button";
import { useState } from "react";
import { singleUpload } from "./uploader.api";

type MultiUploaderProps = {
  uploadUrl: string;
  accept?: string;
  params?: any;
  onUpload?: (data: any) => void;
};

const sizeUnit = (size: number) => {
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

const MultiUploader = ({ uploadUrl, params, onUpload, accept }: MultiUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const upload = async () => {
    try {
      const uploadResults = await Promise.all(
        files.map((file) => singleUpload({ file, params, uploadUrl })),
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
      <div className="d-flex">
        <input
          type="file"
          multiple={true}
          accept={accept}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            addFile(e.currentTarget.files);
            e.currentTarget.value = null;
          }}
        />
        <div className="ml-auto">
          <button className="btn btn-primary btn-sm me-1" onClick={(e) => upload()}>
            업로드
          </button>
        </div>
      </div>
      <div>
        {files.map((file, i) => (
          <div key={file.name}>
            <div className="d-flex">
              <div className="d-flex align-items-center">
                <span className="ml-3">{file.type}</span>
                <span className="ml-3">{file.name}</span>
                <span className="ml-3">{sizeUnit(file.size)}</span>
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
