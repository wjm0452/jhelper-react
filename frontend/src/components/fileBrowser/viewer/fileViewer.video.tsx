import { useEffect, useState } from "react";

const VideoFileViewer = ({ path }: { path: string }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (path) {
      setSrc(`/api/file-viewer/video?path=${encodeURIComponent(path)}`);
    } else {
      setSrc("");
    }
  }, []);

  return (
    <div className="h-100">
      <video controls style={{ maxWidth: "100%" }} autoPlay>
        <source src={src}></source>
      </video>
    </div>
  );
};

export default VideoFileViewer;
