import { useEffect, useState } from "react";
import httpClient from "../../../common/httpClient";
import { Divider } from "primereact/divider";

type EditorHistoryProps = {
  onClick: (item?: any) => void;
};

const EditorHistory = (props: EditorHistoryProps) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    httpClient.get("/api/sql-history").then((data) => {
      setItems(data);
    });
  }, []);

  return (
    <div>
      {items.map((item) => {
        return (
          <>
            <div className="overflow-hidden" style={{ maxHeight: "150px" }}>
              <p>{new Date(item.registerDate).toLocaleString()}</p>
              <p
                key={item.id}
                style={{ whiteSpace: "pre-line", textOverflow: "ellipsis" }}
                className="cursor-pointer"
                title={item.query}
                onClick={() => {
                  props.onClick(item);
                }}
              >
                {item.query}
              </p>
            </div>
            <Divider />
          </>
        );
      })}
    </div>
  );
};

export default EditorHistory;
