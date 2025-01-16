import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Dialog } from "primereact/dialog";
import ConnInfoForm from "./connInfoForm";
import ConnInfoList from "./connInfoList";
import { useSaveConnInfo } from "./connManager.query";
import { useConnInfoStore, useConnManagerStore } from "./connManager.store";

const ConnManager = (props: any) => {
  const connManagerStore = useConnManagerStore();
  const connInfoStore = useConnInfoStore();
  const { mutateAsync: saveConnInfo } = useSaveConnInfo();

  const footerContent = (
    <>
      <ButtonGroup>
        <Button
          label="초기화"
          icon="pi pi-refresh"
          size="small"
          text
          onClick={() => connInfoStore.reset()}
        />
        <Button
          label="저장"
          icon="pi pi-check"
          size="small"
          text
          onClick={() => saveConnInfo(connInfoStore)}
        />
        <Button
          label="닫기"
          icon="pi pi-times"
          size="small"
          text
          severity="secondary"
          onClick={() => connManagerStore.hide()}
        />
      </ButtonGroup>
    </>
  );

  return (
    <Dialog
      visible={connManagerStore.visible}
      header="Connections"
      onHide={() => {
        connManagerStore.hide();
      }}
      position="center"
      footer={footerContent}
    >
      <div className="d-flex flex-row">
        <div className="flex-grow-1 p-1">
          <ConnInfoList />
        </div>
        <div className="flex-grow-0 p-1" style={{ flexBasis: "300px" }}>
          <ConnInfoForm />
        </div>
      </div>
    </Dialog>
  );
};

export default ConnManager;
