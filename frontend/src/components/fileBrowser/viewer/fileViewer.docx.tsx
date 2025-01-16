const DocxFileViewer = ({ path }: { path: string }) => {
  return (
    <div className="h-100">
      <object
        data={`/api/file-viewer/docx?path=${encodeURIComponent(path)}`}
        type="text/html"
        style={{ width: "100%", height: "100%" }}
      ></object>
    </div>
  );
};

export default DocxFileViewer;
