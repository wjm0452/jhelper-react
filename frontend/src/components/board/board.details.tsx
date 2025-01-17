import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBoard, useGetBoard, useSaveBoard } from "./board.query.ts";
import { Button } from "primereact/button";

type InputFormProps = {
  item: Board;
  setItem: (board: Board) => void;
  readOnly: boolean;
};

const InputForm = ({ item, setItem, readOnly }: InputFormProps) => {
  return (
    <>
      <div className="col-md-6 flex-grow-0">
        <label className="form-label">작성자</label>
        <input type="text" className="form-control" value={item.registerId} readOnly={true}></input>
      </div>
      <div className="col-md-6 flex-grow-0">
        <label className="form-label">작성일</label>
        <input
          type="datetime-local"
          className="form-control"
          value={item.registerDate}
          readOnly={true}
        ></input>
      </div>
      <div className="col-12 flex-grow-0">
        <label className="form-label">제목</label>
        <input
          type="text"
          className="form-control"
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
          readOnly={readOnly}
        ></input>
      </div>
    </>
  );
};

type ActionButtonProps = {
  item: Board;
  readOnly: boolean;
};

const ActionButtons = ({ item, readOnly }: ActionButtonProps) => {
  const navigate = useNavigate();
  const { mutateAsync: mutateSaveBoard } = useSaveBoard();
  const { mutateAsync: mutateDeleteBoard } = useDeleteBoard();

  return (
    <>
      {readOnly ? (
        <Button
          label="삭제"
          icon="pi pi-times"
          size="small"
          text
          onClick={async () => {
            await mutateDeleteBoard(item.id);
            navigate(-1);
          }}
        />
      ) : (
        <></>
      )}
      <Button
        label="저장"
        icon="pi pi-check"
        size="small"
        text
        onClick={async () => {
          const newBoard = await mutateSaveBoard(item);
          if (!item.id) {
            navigate(`./${newBoard.id}`, { replace: true });
          }
        }}
      />
      <Button
        label="이전"
        icon="pi pi-arrow-left"
        size="small"
        text
        severity="secondary"
        onClick={() => {
          navigate(-1);
        }}
      />
    </>
  );
};

const BoardDetails = () => {
  const { boardId } = useParams(); // path parameters

  const { refetch: refetchBoard } = useGetBoard(boardId, { enabled: false });
  const [item, setItem] = useState({
    id: "",
    title: "",
    content: "",
    registerId: "",
    registerDate: "",
  });

  const loginUser = useSelector((state: any) => state.login).data;
  const isWriter = item.registerId ? item.registerId == loginUser.username : true;

  useEffect(() => {
    if (boardId) {
      refetchBoard().then(({ data }) => {
        setItem({ ...data });
      });
    } else {
      setItem({ ...item, registerId: loginUser.username });
    }
    return () => {
      // unmount
    };
  }, [boardId]);

  return (
    <div className="h-100">
      <div className="container h-100">
        <div className="d-flex flex-column h-100">
          <div className="row g-3 flex-grow-0">
            <InputForm item={item} setItem={setItem} readOnly={!isWriter} />
          </div>
          <div className="row g-3 flex-grow-1 overflow-hidden">
            <div className="col-12 h-100">
              <label className="form-label">내용</label>
              {isWriter ? (
                <MDEditor
                  value={item.content}
                  height="calc(100% - 42px)"
                  onChange={(value) => setItem({ ...item, content: value })}
                />
              ) : (
                <MDEditor.Markdown source={item.content} />
              )}
            </div>
          </div>
          <div className="row g-3 flex-grow-0">
            <div className="col-12 text-end">
              <ActionButtons item={item} readOnly={isWriter && !!item.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;
