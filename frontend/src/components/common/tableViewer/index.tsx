import { PropsWithChildren } from "react";
import guid from "../../../common/guid";
import "./style.scss";

type TableViewProps = {
  header: string[];
  data: string[][];
  onClick?: (data: any) => void;
};

const TableView = (props: TableViewProps) => {
  const header = props.header || [];
  const data = props.data || [];
  const onClick = props.onClick || function () {};

  return (
    <TableWrap>
      <Headers data={header} />
      <Body header={header} data={data} onClick={onClick} />
    </TableWrap>
  );
};

const TableWrap = ({ children }: PropsWithChildren) => {
  return <table className="table table-hover table-bordered">{children}</table>;
};

const Headers = ({ data }: { data: string[] }) => {
  if (!data || data.length == 0) {
    return <></>;
  }
  return (
    <thead className="table-light">
      <tr>
        {data.map((text: string) => (
          <th key={guid()} className="text-center">
            {text}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const Body = ({
  header,
  data,
  onClick,
}: {
  header: any[];
  data: string[][];
  onClick: ({
    rowIndex,
    cellIndex,
    item,
  }: {
    rowIndex: number;
    cellIndex: number;
    item: string[];
  }) => void;
}) => {
  if (!data) {
    return <></>;
  }

  return (
    <tbody>
      {data.map((item: string[], rowIndex: number) => (
        <tr key={`${rowIndex}`}>
          {item.map((value: string, cellIndex) => (
            <td
              key={`${rowIndex}_${cellIndex}`}
              onClick={() => onClick({ rowIndex, cellIndex, item })}
            >
              {value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

TableView.TableWrap = TableWrap;
TableView.Headers = Headers;
TableView.Body = Body;

export default TableView;
