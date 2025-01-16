import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";

// Blob을 Base64로 변환하는 함수
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      // reader.result는 base64로 변환된 결과를 포함
      resolve(e.target.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob); // Blob을 Base64 형식으로 읽음
  });
};

const ImageFileViewer = ({ path }: { path: string }) => {
  const [src, setSrc] = useState("");

  const setImageSrc = async (path: string) => {
    const data = await fileCommandApi.getFile(path, { responseType: "blob" });
    const base64 = await blobToBase64(data);
    setSrc(base64);
  };

  useEffect(() => {
    if (path) {
      setImageSrc(path);
    }
  }, [path]);

  return (
    <div className="flex justify-content-center align-items-center h-100">
      <img src={src}></img>
    </div>
  );
};

export default ImageFileViewer;
