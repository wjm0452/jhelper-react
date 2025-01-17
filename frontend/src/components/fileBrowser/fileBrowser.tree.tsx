import { Tree } from "primereact/tree";
import { useEffect, useState } from "react";
import { useFileBrowserStore } from "./fileBrowser.store";
import { getFileList } from "./fileBrowser.api";

type FileNodeType = {
  key: string;
  label: string;
  leaf: boolean;
  icon: string;
  data: {
    path: string;
    type: string;
  };
  children?: any[];
};

const getRootNodes = async (path: string): Promise<any[]> => {
  const parentNode: FileNodeType = {
    key: "0",
    label: path,
    leaf: false,
    icon: "pi pi-fw pi-folder",
    data: {
      path: path,
      type: "DIR",
    },
  };

  const list = await getFileList({ path, filter: { type: "DIR" } });
  parentNode.children = list.map((file, i) => ({
    key: parentNode.key + "-" + i,
    label: file.name,
    leaf: file.type != "DIR",
    icon: file.type == "DIR" ? "pi pi-fw pi-folder" : "pi pi-fw pi-file",
    data: file,
  }));

  return [parentNode];
};

const FileBrowserTree = ({ path }: { path: string }) => {
  const fileBrowserStore = useFileBrowserStore();

  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<any>({ "0": true });

  const getNodeBy = (key: string) => {
    const parentKeys = key.split("-");
    const parentNode = parentKeys.reduce((previousValue: any, currentValue: any, currentIndex) => {
      const value = previousValue[currentValue];

      if (currentIndex == parentKeys.length - 1) {
        return value;
      }

      return value.children ? value.children : value;
    }, nodes);

    return parentNode;
  };

  const loadOnExpand = async (e: any) => {
    const parentNode = getNodeBy(e.node.key);

    if (!e.node.children && e.node.data.type == "DIR") {
      setLoading(true);

      // name, path, owner, lastModifiedTime
      const list = await getFileList({ path: parentNode.data.path, filter: { type: "DIR" } });
      parentNode.children = list.map((file, i) => ({
        key: parentNode.key + "-" + i,
        label: file.name,
        leaf: file.type != "DIR",
        icon: file.type == "DIR" ? "pi pi-fw pi-folder" : "pi pi-fw pi-file",
        data: file,
      }));

      setLoading(false);
    }

    if (parentNode.children) {
      parentNode.icon = "pi pi-fw pi-folder-open";
    }
  };

  const onCollapse = (e: any) => {
    const parentNode = getNodeBy(e.node.key);
    parentNode.icon = "pi pi-fw pi-folder";
  };

  useEffect(() => {
    (async () => {
      if (path) {
        setNodes(await getRootNodes(path));
        setLoading(false);

        if (!fileBrowserStore.path) {
          fileBrowserStore.setPath(path);
        }
      }
    })();
  }, [path]);

  return (
    <div className="overflow-auto w-100 h-100">
      <Tree
        className="w-100 h-100"
        value={nodes}
        onExpand={loadOnExpand}
        onCollapse={onCollapse}
        loading={loading}
        selectionMode="single"
        selectionKeys={selectedNodeKey}
        onSelectionChange={(e: any) => setSelectedNodeKey(e.value)}
        onSelect={({ node }: { node: any }) => fileBrowserStore.setPath(node.data.path)}
        onNodeDoubleClick={async (e: any) => {
          if (expandedKeys[e.node.key]) {
            delete expandedKeys[e.node.key];
          } else {
            await loadOnExpand(e);
            expandedKeys[e.node.key] = true;
          }
          setExpandedKeys({ ...expandedKeys });
        }}
        expandedKeys={expandedKeys}
        onToggle={(e) => {
          setExpandedKeys(e.value);
        }}
      />
    </div>
  );
};

export default FileBrowserTree;
