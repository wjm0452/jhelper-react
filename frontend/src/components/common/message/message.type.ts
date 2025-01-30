type ConfirmMessageProps = {
  header?: string;
  message: any;
  icon?: string;
  accept?: () => void;
  reject?: () => void;
};

type AlertMessageProps = {
  header?: string;
  message: any;
  onClose?: () => void;
};
