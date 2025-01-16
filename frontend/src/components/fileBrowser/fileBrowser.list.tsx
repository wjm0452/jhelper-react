import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { useEffect, useState } from "react";
import { dateUtils } from "../../common/dateUtils";
import { useGetFileList } from "./fileBrowser.query";
import { useFileBrowserStore } from "./fileBrowser.store";
import FileBrowserToolbar from "./toolbar/fileBrowser.toolbar";
import FileViewerWrap from "./viewer";

type CheckFileType = FileType & {
  checked: boolean;
};

const getFileIco = (path: string) => {
  path = path.toLowerCase();
  if (/\S+.json|txt/.test(path)) {
    return "pi pi-file";
  } else if (/\S+.md/.test(path)) {
    return "pi pi-file";
  } else if (/\S+.jpg|gif|png/.test(path)) {
    return "pi pi-image";
  } else if (/\S+.avi|mp4/.test(path)) {
    return "pi pi-video";
  } else if (/\S+.pdf/.test(path)) {
    return "pi pi-file-pdf";
  } else if (/\S+.xlsx|xls/.test(path)) {
    return "pi pi-file-excel";
  } else if (/\S+.docx|doc/.test(path)) {
    return "pi pi-file-word";
  } else {
    return "pi pi-file";
  }
};

const checkboxOptions = ({
  field,
  onChange,
  onHeaderChange,
}: {
  field: string;
  onChange?: (e: any) => void;
  onHeaderChange?: (e: any) => void;
}) => {
  return {
    field,
    header: ({ props }: any) => {
      return (
        <Checkbox
          checked={props.value?.every((value: any) => value[field]) || false}
          onChange={(e) => {
            props.value.forEach((value: any) => (value[field] = e.checked));
            onHeaderChange && onHeaderChange({ value: props.value });
          }}
        />
      );
    },
    body: (value: any, columnBodyOptions: any) => {
      return (
        <Checkbox
          checked={value[field]}
          onChange={() => {
            value[field] = !value[field];
            onChange && onChange({ value });
          }}
        />
      );
    },
    headerStyle: {
      width: "3rem",
    },
  };
};

const FileBrowserList = () => {
  const fileBrowserStore = useFileBrowserStore();
  const { data: files, isLoading } = useGetFileList(fileBrowserStore);
  const [fileList, setFileList] = useState<CheckFileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<CheckFileType>();
  const [viewerPath, setViewerPath] = useState("");
  const [showViewer, setShowViewer] = useState(false);

  const doubleClickHandler = (data: FileType) => {
    if (data.type == "DIR") {
      fileBrowserStore.setPath(data.path);
    } else {
      setViewerPath(data.path);
      setShowViewer(true);
      // fileCommandApi.downloadFiles({ files: [data.path] });
    }
  };

  useEffect(() => {
    fileBrowserStore.setActiveFile(null);
    fileBrowserStore.setSelectedFiles([]);
    setFileList(files?.map((f) => ({ ...f, checked: false })));
  }, [files]);

  const typeTemplate = (data: CheckFileType) => {
    if (data.type == "DIR") {
      return <i className="pi pi-folder"></i>;
    } else {
      return <i className={getFileIco(data.name)}></i>;
    }
  };

  return (
    <div className="w-100 h-100">
      <FileBrowserToolbar />
      <FileViewerWrap
        path={viewerPath}
        show={showViewer}
        onClose={() => {
          setShowViewer(false);
        }}
      />
      <DataTable
        value={fileList}
        loading={isLoading}
        resizableColumns
        stripedRows
        selectionMode="single"
        selection={selectedFile}
        onSelectionChange={(e: any) => {
          setSelectedFile(e.value);
          fileBrowserStore.setActiveFile(e.value);
        }}
        sortMode="single"
        tableStyle={{ minWidth: "50rem" }}
        onRowDoubleClick={(e: DataTableRowClickEvent) => {
          doubleClickHandler(e.data as FileType);
        }}
        onKeyDown={(e) => {
          console.log(e.currentTarget);
        }}
      >
        <Column
          {...checkboxOptions({
            field: "checked",
            onHeaderChange: () => {
              fileBrowserStore.setSelectedFiles(fileList?.filter((f) => f.checked));
            },
            onChange: () => {
              fileBrowserStore.setSelectedFiles(fileList?.filter((f) => f.checked));
            },
          })}
        ></Column>
        <Column
          field="type"
          header="Type"
          align="center"
          headerStyle={{ width: "3rem" }}
          body={typeTemplate}
          sortable
        ></Column>
        <Column field="name" header="Name" headerStyle={{ width: "" }} sortable></Column>
        <Column
          field="path"
          header="path"
          headerStyle={{ width: "" }}
          sortable
          hidden={true}
        ></Column>
        <Column field="owner" header="owner" headerStyle={{ width: "12rem" }} sortable></Column>
        <Column
          field="lastModifiedTime"
          header="lastModifiedTime"
          headerStyle={{ width: "12rem" }}
          sortable
          body={({ lastModifiedTime }) =>
            dateUtils.toString(dateUtils.toDate(lastModifiedTime), "yyyy-MM-dd HH:mm:ss")
          }
        ></Column>
        <Column
          field="size"
          header="Size"
          headerStyle={{ width: "3rem" }}
          sortable
          sortFunction={({ order, data }) => {
            return data.sort((a: any, b: any) => {
              const aSize = a.type == "DIR" ? 0 : a.size;
              const bSize = b.type == "DIR" ? 0 : b.size;

              if (order == 1) {
                return aSize - bSize;
              } else {
                return bSize - aSize;
              }
            });
          }}
          body={({ type, size }) => {
            if (type != "FILE") {
              return "";
            }
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
          }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default FileBrowserList;
