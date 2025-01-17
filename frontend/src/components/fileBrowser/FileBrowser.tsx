import { Splitter, SplitterPanel } from "primereact/splitter";
import FileBrowserList from "./fileBrowser.list";
import { useGetFileRoot } from "./fileBrowser.query";
import FileBrowserTree from "./fileBrowser.tree";

const FileBrowser = () => {
  const { data: rootFile } = useGetFileRoot();

  return (
    <Splitter className="w-100 h-100" stateStorage="session" stateKey="fileBrowser.splitter">
      <SplitterPanel size={30} className="overflow-hidden p-1">
        <FileBrowserTree path={rootFile?.path} />
      </SplitterPanel>
      <SplitterPanel size={70} className="overflow-hidden p-1">
        <FileBrowserList />
      </SplitterPanel>
    </Splitter>
  );
};

export default FileBrowser;
