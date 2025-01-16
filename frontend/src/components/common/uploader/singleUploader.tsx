import { useState } from "react";
import { singleUpload } from "./uploader.api";

type SingleUploaderProps = {
  uploadUrl: string;
  accept?: string;
  params?: any;
  onUpload?: (data: any) => void;
};

const SingleUploader = ({ uploadUrl, params, onUpload, accept }: SingleUploaderProps) => {
  const [file, setFile] = useState<File>(null);
  const upload = async () => {
    try {
      const uploadResult = await singleUpload({ file, params, uploadUrl });
      onUpload && onUpload(uploadResult);
    } catch (message) {
      window.alert(message);
    }
  };

  return (
    <>
      <input
        type="file"
        multiple={false}
        accept={accept}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files[0])}
      />
      <button className="btn btn-primary btn-sm me-1" onClick={(e) => upload()}>
        업로드
      </button>
    </>
  );
};

export default SingleUploader;
