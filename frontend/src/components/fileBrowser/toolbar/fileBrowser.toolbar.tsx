import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import MultiUploader from "../../common/uploader/multiUploader";
import fileCommandApi from "../command/fileCommand.api";
import useFileCommandQuery from "../command/fileCommand.query";
import { useFileCommandStore } from "../command/fileCommand.store";
import { useGetFileList } from "../fileBrowser.query";
import { useFileBrowserStore } from "../fileBrowser.store";
import FileBrowserToolbarDetailSearch from "./fileBrowser.detailsSearch";
import FileBrowserNewFile from "./fileBrowser.newFile";
import FileBrowserRenameFile from "./fileBrowser.renameFile";
import FileBrowserFileIndexing from "./fileBrowser.indexLog";
import { useMessageStoreInContext } from "../../common/message/message.context";

type FileBrowserToolbarProps = {};

const toPath = (files: FileType[]) => files.map((file) => file.path);

const FileBrowserToolbar = ({}: FileBrowserToolbarProps) => {
  const messageStore = useMessageStoreInContext();
  const fileBrowserStore = useFileBrowserStore();
  const fileCommandStore = useFileCommandStore();
  const [pathForView, setPathForView] = useState<string>("");
  const [includeSubDirs, setIncludeSubDirs] = useState(false);

  const detailPannel = useRef<OverlayPanel>(); // detail search panel
  const newFilePannel = useRef<OverlayPanel>(); // upload panel
  const renamePannel = useRef<OverlayPanel>(); // rename panel
  const uploadPannel = useRef<OverlayPanel>(); // upload panel
  const indexingPannel = useRef<OverlayPanel>(); // upload panel

  const { refetch } = useGetFileList(fileBrowserStore, { enabled: false });

  const fileCommandQuery = useFileCommandQuery();

  useEffect(() => {
    setPathForView(fileBrowserStore.path);
  }, [fileBrowserStore.path]);

  const movePrev = () => {
    fileBrowserStore.prev();
  };

  const moveNext = () => {
    fileBrowserStore.next();
  };

  const newFile = async ({ path, type, name }: { path: string; type: string; name: string }) => {
    fileCommandStore.setCommand("new");
    if (!path || !name) {
      return;
    }

    await fileCommandQuery.newFile({ path, type, name });
    messageStore.toast("File Command", "Created");
  };

  const copyFiles = () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    fileCommandStore.setCommand("copy");
    fileCommandStore.setFiles([...fileBrowserStore.selectedFiles]);

    messageStore.toast("File Command", "Copy");
  };

  const cutFiles = () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    fileCommandStore.setCommand("cut");
    fileCommandStore.setFiles([...fileBrowserStore.selectedFiles]);

    messageStore.toast("File Command", "Cut");
  };

  const pasteFiles = async () => {
    if (fileCommandStore.command == "copy") {
      await fileCommandQuery.copyFiles({
        files: toPath(fileCommandStore.files),
        path: fileBrowserStore.path,
      });
    } else if (fileCommandStore.command == "cut") {
      await fileCommandQuery.moveFiles({
        files: toPath(fileCommandStore.files),
        path: fileBrowserStore.path,
      });
    }
    fileCommandStore.setCommand("paste");
    messageStore.toast("File Command", "Pasted");
    refetch();
  };

  const renameFile = async ({ path, changeName }: { path: string; changeName: string }) => {
    if (!path || !changeName) {
      return;
    }

    fileCommandStore.setCommand("rename");
    await fileCommandQuery.renameFile({ path, changeName });
    messageStore.toast("File Command", "Rename");
    refetch();
  };

  const deleteFiles = async () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    fileCommandStore.setCommand("delete");
    await fileCommandQuery.deleteFiles({ files: toPath(fileBrowserStore.selectedFiles) });
    messageStore.toast("File Command", "Deleted");
    refetch();
  };

  const downloadFiles = async () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    messageStore.toast("File Command", "Download...");
    fileCommandStore.setCommand("download");
    await fileCommandApi.downloadFiles({ files: toPath(fileBrowserStore.selectedFiles) });
  };

  const exportFiles = async () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    fileCommandStore.setCommand("export");
    messageStore.toast("File Command", "Export...");
    await fileCommandApi.exportFiles({ files: toPath(fileBrowserStore.selectedFiles) });
  };

  const copyToClipboard = () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    const lines = fileBrowserStore.selectedFiles.map(
      ({ name, path, owner, type, lastModifiedTime }: FileType) =>
        `${type}\t${name}\t${path}\t${owner}\t${lastModifiedTime}`,
    );
    navigator.clipboard.writeText(lines.join("\r\n"));
    messageStore.toast("File Command", "Copy to clipboard");
  };

  const fileToBoard = async () => {
    if (!fileBrowserStore.selectedFiles || !fileBrowserStore.selectedFiles.length) {
      return;
    }

    fileCommandStore.setCommand("board");
    await fileCommandApi.fileToBoard({ files: toPath(fileBrowserStore.selectedFiles) });
    messageStore.toast("File Command", "Create board");
  };

  const start = (
    <div>
      <div className="d-flex mb-3">
        <Button icon="pi pi-arrow-left" rounded text aria-label="Left" onClick={movePrev} />
        <Button icon="pi pi-arrow-right" rounded text aria-label="Right" onClick={moveNext} />
        <Button icon="pi pi-refresh" rounded text aria-label="Refresh" onClick={() => refetch()} />
        <IconField iconPosition="left" style={{ marginLeft: "0.5rem" }}>
          <InputIcon className="pi pi-desktop" />
          <InputText
            placeholder="Path"
            value={pathForView}
            onChange={(e) => setPathForView(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                fileBrowserStore.setPath(pathForView);
              } else if (e.key == "Escape") {
                setPathForView(fileBrowserStore.path);
              }
            }}
            style={{ width: "550px" }}
          />
        </IconField>
      </div>
      <div className="d-flex">
        <Button
          icon="pi pi-file-plus"
          rounded
          text
          aria-label="New"
          label="New"
          title="New"
          onClick={(e) => {
            newFilePannel.current.toggle(e);
          }}
        />
        <Button
          icon="pi pi-minus"
          rounded
          text
          aria-label="Cut"
          label="Cut"
          title="Cut"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={cutFiles}
        />
        <Button
          icon="pi pi-copy"
          rounded
          text
          aria-label="Copy"
          label="Copy"
          title="Copy"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={copyFiles}
        />
        <Button
          icon="pi pi-clipboard"
          rounded
          text
          aria-label="Paste"
          label="Paste"
          title="Copy"
          disabled={(() => !["cut", "copy"].includes(fileCommandStore.command))()}
          onClick={pasteFiles}
        />
        <Button
          icon="pi pi-file-edit"
          rounded
          text
          aria-label="Rename"
          label="Rename"
          title="Rename"
          disabled={fileBrowserStore.activeFile == null}
          onClick={(e) => {
            renamePannel.current.toggle(e);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          aria-label="Trash"
          label="Delete"
          title="Delete"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={deleteFiles}
        />
        <Button
          icon="pi pi-file-plus"
          rounded
          text
          aria-label="Upload"
          label="Upload"
          title="Upload"
          onClick={(e) => {
            uploadPannel.current.toggle(e);
          }}
        />
        <Button
          icon="pi pi-download"
          rounded
          text
          aria-label="Download"
          label="Download"
          title="Download"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={downloadFiles}
        />
        <Button
          icon="pi pi-file-export"
          rounded
          text
          aria-label="Export"
          label="Export"
          title="Export"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={exportFiles}
        />
        <Button
          icon="pi pi-clipboard"
          rounded
          text
          aria-label="Clipboard"
          label="Clipboard"
          title="Clipboard"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={copyToClipboard}
        />
        <Button
          icon="pi pi-book"
          rounded
          text
          aria-label="게시물 등록"
          label="게시물 등록"
          title="게시물 등록"
          disabled={(() => fileBrowserStore.selectedFiles.length == 0)()}
          onClick={fileToBoard}
        />
        <Button
          icon="pi pi-book"
          rounded
          text
          aria-label="색인"
          label="색인"
          title="색인"
          onClick={async (e) => {
            indexingPannel.current.toggle(e);
          }}
        />
      </div>
    </div>
  );

  const end = (
    <div>
      <div className="d-flex align-items-center">
        <Checkbox
          inputId="includeSubDirs"
          onChange={(e: CheckboxChangeEvent) => setIncludeSubDirs(e.checked)}
          checked={includeSubDirs}
          title="하위 검색은 색인된 대상만 조회 됩니다."
        ></Checkbox>
        <label
          htmlFor="includeSubDirs"
          className="ml-2"
          title="하위 검색은 색인된 대상만 조회 됩니다."
        >
          하위포함
        </label>
        <IconField iconPosition="left" style={{ marginLeft: "0.5rem" }}>
          <InputIcon className="pi pi-search" />
          <InputText
            placeholder="Search"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                fileBrowserStore.putAll({
                  filter: { name: e.currentTarget.value, includeSubDirs },
                });
              }
            }}
          />
        </IconField>
        <OverlayPanel ref={detailPannel} dismissable={true}>
          <FileBrowserToolbarDetailSearch
            filter={fileBrowserStore.filter}
            onSubmit={(filter) => {
              detailPannel.current.hide();
              fileBrowserStore.putAll({ filter: { ...filter } });
            }}
          />
        </OverlayPanel>
        <OverlayPanel ref={newFilePannel} dismissable={true}>
          <FileBrowserNewFile
            path={fileBrowserStore.path}
            onSubmit={({ path, type, name }: { path: string; type: string; name: string }) => {
              newFilePannel.current.hide();
              newFile({ path, type, name });
            }}
          />
        </OverlayPanel>
        <OverlayPanel ref={renamePannel} dismissable={true}>
          <FileBrowserRenameFile
            path={fileBrowserStore.activeFile?.path}
            onSubmit={({ path, changeName }: { path: string; changeName: string }) => {
              renamePannel.current.hide();
              renameFile({ path, changeName });
            }}
          />
        </OverlayPanel>
        <OverlayPanel ref={uploadPannel} dismissable={true}>
          <MultiUploader
            uploadUrl="/api/file-command/upload"
            params={{ path: fileBrowserStore.path }}
            onUpload={() => {
              uploadPannel.current.hide();
              refetch();
            }}
          />
        </OverlayPanel>
        <OverlayPanel ref={indexingPannel} dismissable={false}>
          <div style={{ width: "700px", height: "600px" }}>
            <FileBrowserFileIndexing />
          </div>
        </OverlayPanel>
        <Button
          type="button"
          icon="pi pi-search"
          rounded
          text
          label="상세 검색"
          title="상세 검색"
          onClick={(e) => detailPannel.current.toggle(e)}
        />
      </div>
    </div>
  );

  return <Toolbar start={start} end={end} />;
};

export default FileBrowserToolbar;
