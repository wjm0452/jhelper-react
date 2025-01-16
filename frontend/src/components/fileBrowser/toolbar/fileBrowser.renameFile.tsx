import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import FileBrowserToolbar from "./fileBrowser.toolbar";
import { useFileCommandStore } from "../command/fileCommand.store";
import { useFileBrowserStore } from "../fileBrowser.store";
import { useState } from "react";
import { renameFile } from "../command/fileCommand.api";

type FileBrowserRenameFileProps = {
  path: string;
  onSubmit: ({ path, changeName }: { path: string; changeName: string }) => void;
};

const FileBrowserRenameFile = ({ path, onSubmit }: FileBrowserRenameFileProps) => {
  const [changeName, setChangeName] = useState("");

  return (
    <>
      <div className="field grid">
        <label className="col-11 mb-2 md:col-3 md:mb-0">대상</label>
        <div className="col-11 md:col-8">
          <InputText className="w-full text-base" readOnly value={path} />
        </div>
      </div>
      <div className="field grid">
        <label className="col-11 mb-2 md:col-3 md:mb-0">변경명</label>
        <div className="col-11 md:col-8">
          <InputText
            placeholder="new name"
            className="w-full text-base"
            value={changeName}
            onChange={(e) => setChangeName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit({ path, changeName });
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-content-end">
        <Button
          type="button"
          icon="pi pi-file-edit"
          label="Rename"
          text
          onClick={() => {
            onSubmit({ path, changeName });
          }}
        />
      </div>
    </>
  );
};

export default FileBrowserRenameFile;
