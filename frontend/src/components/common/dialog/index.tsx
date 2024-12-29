import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type ModalPropsType = {
  title?: string;
  visible?: boolean;
  children: any;
  onClose: () => void;
};

const ModalHeader = (props: any) => {
  if (props.children.header) {
    return <>{props.children.header}</>;
  }
  return (
    <>
      <h5 className="modal-title">{props.title}</h5>
      <button type="button" className="btn-close" onClick={() => props.onClose(false)}></button>
    </>
  );
};

const Modal = (props: ModalPropsType) => {
  if (!props.visible) {
    return <></>;
  }

  return (
    <div className="modal" style={{ display: "block" }} tabIndex={-1}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <ModalHeader {...props}></ModalHeader>
          </div>
          <div className="modal-body">{props.children.body}</div>
          <div className="modal-footer">{props.children.footer}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
