import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

type FileBrowserNewFileProps = {
  path: string;
  onSubmit: ({ path, type, name }: { path: string; type: string; name: string }) => void;
};

const FileBrowserNewFile = ({ path, onSubmit }: FileBrowserNewFileProps) => {
  const [type, setType] = useState("FILE");
  const [name, setName] = useState("");

  return (
    <>
      <div className="field grid">
        <label className="col-11 mb-2 md:col-3 md:mb-0">위치</label>
        <div className="col-11 md:col-8">
          <InputText className="w-full text-base" readOnly value={path} />
        </div>
      </div>
      <div className="field grid">
        <label className="col-11 mb-2 md:col-3 md:mb-0">유형</label>
        <div className="col-11 md:col-8">
          <Dropdown
            value={type}
            onChange={(e) => setType(e.value)}
            options={[
              { name: "Directory", code: "DIR" },
              { name: "File", code: "FILE" },
            ]}
            optionLabel="name"
            optionValue="code"
            className="w-full text-base"
          />
        </div>
      </div>
      <div className="field grid">
        <label className="col-11 mb-2 md:col-3 md:mb-0">파일명</label>
        <div className="col-11 md:col-8">
          <InputText
            placeholder="new name"
            className="w-full text-base"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit({ path, type, name });
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-content-end">
        <Button
          type="button"
          icon="pi pi-file"
          label="Create"
          text
          onClick={() => {
            onSubmit({ path, type, name });
          }}
        />
      </div>
    </>
  );
};

export default FileBrowserNewFile;
