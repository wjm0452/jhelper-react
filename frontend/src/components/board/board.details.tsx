import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBoard, useGetBoard, useSaveBoard } from "./board.query.ts";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useMessageStoreInContext } from "../common/message/message.context.tsx";

type InputFormProps = {
  item: Board;
  setItem: (board: Board) => void;
  readOnly: boolean;
};

const InputForm = ({ item, setItem, readOnly }: InputFormProps) => {
  return (
    <>
      <div className="flex gap-3">
        <div className="flex-auto">
          <label className="font-bold block mb-2">작성자</label>
          <InputText value={item.registerId} className="w-full" readOnly={true} />
        </div>
        <div className="flex-auto">
          <label className="font-bold block mb-2">작성일</label>
          <InputText
            type="datetime-local"
            value={item.registerDate}
            className="w-full"
            readOnly={true}
          />
        </div>
      </div>
      <div className="flex-auto">
        <label className="font-bold block mb-2">카테고리</label>
        <Dropdown
          value={item.category}
          onChange={(e) => {
            setItem({ ...item, category: e.value });
          }}
          options={[
            { code: "board", name: "게시판" },
            { code: "file", name: "파일" },
          ]}
          optionLabel="name"
          optionValue="code"
          className="w-full text-base"
        />
      </div>
      <div className="flex-auto">
        <label className="font-bold block mb-2">제목</label>
        <InputText
          type="text"
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
          readOnly={readOnly}
          className="w-full"
        />
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
  const messageStore = useMessageStoreInContext();

  return (
    <>
      {readOnly ? (
        <Button
          label="삭제"
          icon="pi pi-times"
          size="small"
          text
          onClick={async () => {
            if (await messageStore.confirm("선택한 게시물을 삭제 하시겠습니까?")) {
              await mutateDeleteBoard(item.id);
              navigate(-1);
            }
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
    id: null,
    category: "board",
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
