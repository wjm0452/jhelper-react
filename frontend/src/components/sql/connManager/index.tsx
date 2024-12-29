import { useConnManagerStore, useConnInfoStore } from "./store";
import ConnInfoList from "./connInfoList";
import ConnInfoForm from "./connInfoForm";
import { useSaveConnInfo } from "./query";
import Modal from "../../common/dialog";

const ConnManager = (props: any) => {
  const connManagerStore = useConnManagerStore();
  const connInfoStore = useConnInfoStore();
  const { mutateAsync: saveConnInfo } = useSaveConnInfo();

  return (
    <Modal
      title={"Connections"}
      visible={connManagerStore.visible}
      onClose={() => connManagerStore.hide()}
    >
      {{
        body: (
          <div className="d-flex flex-row">
            <div className="flex-grow-1 p-1">
              <ConnInfoList></ConnInfoList>
            </div>
            <div className="flex-grow-0 p-1" style={{ flexBasis: "300px" }}>
              <ConnInfoForm></ConnInfoForm>
            </div>
          </div>
        ),
        footer: (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => connManagerStore.hide()}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => saveConnInfo(connInfoStore)}
            >
              Save changes
            </button>
          </>
        ),
      }}
    </Modal>
  );
};

export default ConnManager;
