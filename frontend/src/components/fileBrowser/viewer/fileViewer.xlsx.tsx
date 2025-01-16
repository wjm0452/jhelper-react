import { useEffect, useState } from "react";
import fileCommandApi from "../command/fileCommand.api";
import { read, utils } from "xlsx";

// toArrayBuffer로 변환하는 함수
const blobToArrayBuffer = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      // reader.result는 base64로 변환된 결과를 포함
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob); // Blob을 Base64 형식으로 읽음
  });
};

const XlsxFileViewer = ({ path }: { path: string }) => {
  const [xlsxHtml, setXlsxHtml] = useState("");

  const setXlsxSrc = async (path: string) => {
    const data = await fileCommandApi.getFile(path, { responseType: "blob" });
    const buffer = await blobToArrayBuffer(data);

    const wb = read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const xlsxData = utils.sheet_to_html(ws);

    setXlsxHtml(xlsxData);
  };

  useEffect(() => {
    if (path) {
      setXlsxSrc(path);
    }
  }, [path]);

  return (
    <div className="h-100 overflow-auto">
      <div className="h-100" dangerouslySetInnerHTML={{ __html: xlsxHtml }}></div>
    </div>
  );
};

export default XlsxFileViewer;
