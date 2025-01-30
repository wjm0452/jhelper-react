import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

const AlertMessage = ({ header = "Alert", message, onClose }: AlertMessageProps) => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <>
      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
          onClose();
        }}
        header={header}
        style={{ width: "50vw" }}
      >
        {message}
        <div className="text-end">
          <Button
            label="Close"
            icon="pi pi-times"
            size="small"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default AlertMessage;
