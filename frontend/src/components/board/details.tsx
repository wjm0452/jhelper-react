import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBoard, useGetBoard, useSaveBoard } from "./query.ts";
import { useBoardStore } from "./store.ts";

const InputForm = (props: any) => {
  const boardStore = useBoardStore();
  return (
    <>
      <div className="col-md-6">
        <label className="form-label">Register Id</label>
        <input
          type="text"
          className="form-control"
          value={boardStore.registerId}
          readOnly={true}
        ></input>
      </div>
      <div className="col-md-6">
        <label className="form-label">Register Date</label>
        <input
          type="datetime-local"
          className="form-control"
          value={boardStore.registerDate}
          readOnly={true}
        ></input>
      </div>
      <div className="col-12">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={boardStore.title}
          onChange={(e) => {
            boardStore.put("title", e.target.value);
          }}
          readOnly={props.readOnly}
        ></input>
      </div>
    </>
  );
};

const ActionButtons = (props: any) => {
  const navigate = useNavigate();
  const boardStore = useBoardStore();
  const { mutateAsync: mutateSaveBoard } = useSaveBoard();
  const { mutateAsync: mutateDeleteBoard } = useDeleteBoard();

  return (
    <>
      <button
        type="button"
        className="btn btn-primary me-md-2"
        onClick={async () => {
          const newBoard = await mutateSaveBoard(props);
          if (!boardStore.id) {
            navigate(`./${newBoard.id}`, { replace: true });
          }
        }}
      >
        Save changes
      </button>
      {props.readOnly ? (
        <button
          type="button"
          className="btn btn-danger me-md-2"
          onClick={async () => {
            await mutateDeleteBoard(boardStore.id);
            navigate(-1);
          }}
        >
          Delete
        </button>
      ) : (
        <></>
      )}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
    </>
  );
};

const Write = (props: any) => {
  const { boardId } = useParams(); // path parameters

  const { data: boardData } = useGetBoard(boardId);
  const boardStore = useBoardStore();

  const loginUser = useSelector((state: any) => state.login).data;
  const isWriter =
    boardStore && boardStore.registerId ? boardStore.registerId == loginUser.username : true;

  useEffect(() => {
    if (boardData) {
      boardStore.putAll(boardData);
    } else {
      boardStore.put("registerId", loginUser.username);
    }
    return () => {
      // unmount
    };
  }, [boardData]);

  return (
    <div className="h-100">
      <div className="container h-100">
        <div className="row g-3">
          <InputForm></InputForm>
          <div className="col-12">
            <label className="form-label">Content</label>
            {isWriter ? (
              <MDEditor
                value={boardStore.content}
                height="500px"
                onChange={(value) => {
                  boardStore.put("content", value);
                }}
              />
            ) : (
              <MDEditor.Markdown source={boardStore.content} />
            )}
          </div>
        </div>
        <div className="text-end mt-2">
          <ActionButtons readOnly={isWriter && boardStore.id}></ActionButtons>
        </div>
      </div>
    </div>
  );
};

export default Write;
