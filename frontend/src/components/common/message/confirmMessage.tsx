import { ConfirmDialog } from "primereact/confirmdialog";
import { useState } from "react";

const ConfirmMessage = ({
  header = "Confirmation",
  icon,
  message,
  accept,
  reject,
}: ConfirmMessageProps) => {
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => {
          setVisible(false);
          reject && reject();
        }}
        message={message}
        header={header}
        icon={icon ? `pi ${icon}` : ""}
        accept={() => {
          accept();
        }}
        reject={() => {
          reject && reject();
        }}
        style={{ width: "50vw" }}
      />
    </>
  );
};

export default ConfirmMessage;
