import { useConnManagerStore, useConnInfoStore } from "./store";
import ConnInfoList from "./connInfoList";
import ConnInfoForm from "./connInfoForm";
import { useSaveConnInfo } from "./query";

const ConnManager = (props: any) => {
  const connManagerStore = useConnManagerStore();
  const connInfoStore = useConnInfoStore();
  const { mutateAsync: saveConnInfo } = useSaveConnInfo();

  return (
    <div
      className="modal"
      style={{
        display: connManagerStore.visible !== false ? "block" : "none",
      }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Connections</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => connManagerStore.hide()}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-row">
              <div className="flex-grow-1 p-1">
                <ConnInfoList></ConnInfoList>
              </div>
              <div className="flex-grow-0 p-1" style={{ flexBasis: "300px" }}>
                <ConnInfoForm></ConnInfoForm>
              </div>
            </div>
          </div>
          <div className="modal-footer">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnManager;
