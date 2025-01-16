import TableView from "../../common/tableViewer";
import { useGetIndexes } from "../sql.query";

type IndexesViewProps = {
  owner: string;
  tableName: string;
};

const IndexesView = ({ owner, tableName }: IndexesViewProps) => {
  const { data } = useGetIndexes({ owner, tableName });

  return (
    <>
      <div className="overflow-auto" style={{ height: "300px" }}>
        <TableView header={data?.columnNames} data={data?.result}></TableView>
      </div>
    </>
  );
};

export default IndexesView;
