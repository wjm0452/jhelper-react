import { Splitter, SplitterPanel } from "primereact/splitter";
import FileBrowserList from "./fileBrowser.list";
import { useGetFileRoot } from "./fileBrowser.query";
import FileBrowserTree from "./fileBrowser.tree";

const FileBrowser = () => {
  const { data: rootFile } = useGetFileRoot();

  return (
    <Splitter className="h-100">
      <SplitterPanel size={30} className="p-1">
        <FileBrowserTree path={rootFile?.path} />
      </SplitterPanel>
      <SplitterPanel size={70} className="p-1">
        <FileBrowserList />
      </SplitterPanel>
    </Splitter>
  );
};

export default FileBrowser;
