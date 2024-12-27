import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBoard, useGetBoard, useSaveBoard } from "./query.ts";

function Write(props: any) {
  const navigate = useNavigate();
  const { boardId } = useParams(); // path parameters

  const loginUser = useSelector((state: any) => state.login).data;
  const { data: item } = useGetBoard(boardId);
  const { mutateAsync: mutateSaveBoard } = useSaveBoard();
  const { mutateAsync: mutateDeleteBoard } = useDeleteBoard();
  const [content, setContent] = useState("");

  const {
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      title: "",
      content: "",
      registerId: loginUser.username,
      registerDate: new Date().toISOString().slice(0, 16),
    },
  });

  const isWriter =
    item && item.registerId ? item.registerId == loginUser.username : true;

  useEffect(() => {
    if (item) {
      reset(item);
      setContent(item.content);
    }
    return () => {
      // unmount
    };
  }, [item]);

  return (
    <div className="h-100">
      <div className="container h-100">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Register Id</label>
            <input
              type="text"
              className="form-control"
              {...register("registerId")}
              readOnly={true}
            ></input>
          </div>
          <div className="col-md-6">
            <label className="form-label">Register Date</label>
            <input
              type="datetime-local"
              className="form-control"
              {...register("registerDate")}
              readOnly={true}
            ></input>
          </div>
          <div className="col-12">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              {...register("title", { required: true })}
              readOnly={!isWriter}
            ></input>
            {errors.title && <span>This field is required</span>}
          </div>
          <div className="col-12">
            <label className="form-label">Content</label>
            {isWriter ? (
              <MDEditor
                value={content}
                height="500px"
                onChange={(value) => {
                  setContent(value);
                }}
              />
            ) : (
              <MDEditor.Markdown source={content} />
            )}
          </div>
        </div>
        <div className="text-end mt-2">
          <button
            type="button"
            className="btn btn-primary me-md-2"
            onClick={async () => {
              const newBoard = await mutateSaveBoard({
                ...getValues(),
                content,
              });
              if (!boardId) {
                navigate(`./${newBoard.id}`, { replace: true });
              }
            }}
          >
            Save changes
          </button>
          {boardId && isWriter ? (
            <button
              type="button"
              className="btn btn-danger me-md-2"
              onClick={async () => {
                await mutateDeleteBoard(boardId);
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
        </div>
      </div>
    </div>
  );
}

export default Write;
