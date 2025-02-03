import { Button } from "primereact/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import JobLog from "../../common/log";
import fileCommandApi from "../command/fileCommand.api";
import { useFileCommandStore, useFileIndexingStore } from "../command/fileCommand.store";
import { useFileBrowserStore } from "../fileBrowser.store";
import { useMessageStoreInContext } from "../../common/message/message.context";

const toPath = (files: FileType[]) => files.map((file) => file.path);

const useFiles = (): [string[], Dispatch<SetStateAction<string[]>>] => {
  const fileBrowserStore = useFileBrowserStore();
  const [files, setFiles] = useState<string[]>(toPath(fileBrowserStore.selectedFiles));
  return [files, setFiles];
};

const FileBrowserFileIndexing = () => {
  const fileBrowserStore = useFileBrowserStore();
  const fileCommandStore = useFileCommandStore();
  const fileIndexingStore = useFileIndexingStore();
  const messageStore = useMessageStoreInContext();

  useEffect(() => {
    if (!fileIndexingStore.isRunning) {
      fileIndexingStore.setIndexingFiles(toPath(fileBrowserStore.selectedFiles));
    }
  }, []);

  const indexingAllFiles = async () => {
    if (
      !(await messageStore.confirm(`"${fileBrowserStore.path}" 디렉토리 색인을 수행 하시겠습니까?`))
    ) {
      return;
    }

    fileCommandStore.setCommand("indexing_all");
    fileIndexingStore.setIndexingFiles([fileBrowserStore.path]);
    const { jobId: newJobId } = await fileCommandApi.indexingFiles({
      files: [fileBrowserStore.path],
    });

    fileIndexingStore.setJobId(newJobId);
    fileIndexingStore.setRunning(true);
  };

  const indexingFiles = async () => {
    if (!fileIndexingStore.indexingFiles.length) {
      await messageStore.alert("선택된 파일이 없습니다.");
      return;
    }

    if (!(await messageStore.confirm(`선택된 파일의 색인을 수행 하시겠습니까`))) {
      return;
    }

    fileCommandStore.setCommand("indexing");
    const { jobId: newJobId } = await fileCommandApi.indexingFiles({
      files: fileIndexingStore.indexingFiles,
    });

    fileIndexingStore.setJobId(newJobId);
    fileIndexingStore.setRunning(true);
  };

  const indexingFilesToTerminate = async () => {
    fileCommandStore.setCommand("indexing_terminate");
    await fileCommandApi.indexingFilesToTerminate();
  };

  return (
    <div className="w-100 h-100 flex flex-column">
      <div className="mb-1 overflow-auto" style={{ maxHeight: "200px" }}>
        {fileIndexingStore.indexingFiles.map((file, i) => {
          return <div key={i}>{file}</div>;
        })}
      </div>
      <div className="flex-grow-1">
        <JobLog jobId={fileIndexingStore.jobId} isStart={fileIndexingStore.isRunning} />
      </div>
      <div className="text-end">
        <Button
          rounded
          text
          aria-label="All"
          label="All"
          onClick={async (e) => {
            await indexingAllFiles();
          }}
        />
        <Button
          rounded
          text
          aria-label="Indexing"
          label="Indexing"
          onClick={async (e) => {
            await indexingFiles();
          }}
        />
        <Button
          rounded
          text
          aria-label="Terminate"
          label="Terminate"
          onClick={async (e) => {
            await indexingFilesToTerminate();
          }}
        />
      </div>
    </div>
  );
};

export default FileBrowserFileIndexing;
