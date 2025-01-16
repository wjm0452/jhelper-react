import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

type FileBrowserToolbarDetailSearchProps = {
  filter: FileBrowserFilterType;
  onSubmit: (filter: FileBrowserFilterType) => void;
};

const FileBrowserToolbarDetailSearch = ({
  filter: initFilter,
  onSubmit,
}: FileBrowserToolbarDetailSearchProps) => {
  const [filter, setFilter] = useState<FileBrowserFilterType>(initFilter);

  return (
    <>
      <div className="field grid">
        <label className="col-10 mb-3 md:col-3 md:mb-0">타입</label>
        <div className="col-10 md:col-7">
          <Dropdown
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.value })}
            options={[
              { name: "All", code: "" },
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
        <label className="col-10 mb-3 md:col-3 md:mb-0">파일명</label>
        <div className="col-10 md:col-7">
          <InputText
            placeholder="Name"
            className="w-full text-base"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.currentTarget.value })}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit(filter);
              }
            }}
          />
        </div>
      </div>
      <div className="field grid">
        <label className="col-10 mb-3 md:col-3 md:mb-0">시작일시</label>
        <div className="col-10 md:col-7">
          <InputText
            type="datetime-local"
            placeholder="From"
            className="w-full text-base"
            value={filter.from}
            onChange={(e: any) => setFilter({ ...filter, from: e.currentTarget.value })}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit(filter);
              }
            }}
          />
        </div>
      </div>
      <div className="field grid">
        <label className="col-10 mb-# md:col-3 md:mb-0">종료일시</label>
        <div className="col-10 md:col-7">
          <InputText
            type="datetime-local"
            placeholder="To"
            className="w-full text-base"
            value={filter.to}
            onChange={(e: any) => setFilter({ ...filter, to: e.currentTarget.value })}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit(filter);
              }
            }}
          />
        </div>
      </div>
      <div className="field grid">
        <label className="col-10 mb-3 md:col-3 md:mb-0">제외파일</label>
        <div className="col-10 md:col-7">
          <InputText
            placeholder="From"
            className="w-full text-base"
            value={filter.exclusionName}
            onChange={(e: any) => setFilter({ ...filter, exclusionName: e.currentTarget.value })}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSubmit(filter);
              }
            }}
          />
        </div>
      </div>
      <div className="">
        <Checkbox
          inputId="det_includeSubDirs"
          onChange={(e: CheckboxChangeEvent) => setFilter({ ...filter, includeSubDirs: e.checked })}
          checked={filter.includeSubDirs}
        ></Checkbox>
        <label htmlFor="det_includeSubDirs" className="ml-2">
          하위포함
        </label>
      </div>
      <div className="flex justify-content-end">
        <Button
          type="button"
          icon="pi pi-refresh"
          label="초기화"
          text
          onClick={() => {
            setFilter({
              type: "",
              name: "",
              from: "",
              to: "",
              exclusionName: "",
              includeSubDirs: false,
            });
          }}
        />
        <Button
          type="button"
          icon="pi pi-search"
          label="찾기"
          text
          onClick={() => onSubmit(filter)}
        />
        <Button
          type="button"
          icon="pi pi-refresh"
          label="초기화"
          text
          onClick={() => {
            setFilter({
              type: "",
              name: "",
              from: "",
              to: "",
              includeSubDirs: false,
            });
          }}
        />
      </div>
    </>
  );
};

export default FileBrowserToolbarDetailSearch;
