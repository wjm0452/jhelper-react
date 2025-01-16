import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useRef, useState } from "react";
import ConnectionForm from "../sql/objectView/connectionForm";
import TablesView from "../sql/objectView/tablesView";
import { ConnectionStoreProvider } from "../sql/sql.context";
import EditableTableColumns from "./editableTableColumns";
import { loadData } from "./sqlLoader.api";

const DataLoader = () => {
  const [sourceData, setSourceData] = useState({
    name: "",
    owner: "",
    tableName: "",
  });

  const [targetData, setTargetData] = useState({
    name: "",
    owner: "",
    tableName: "",
  });

  const [query, setQuery] = useState("");

  const sourceColumnRef = useRef<any>();
  const targetColumnRef = useRef<any>();

  const goLoadData = async () => {
    if (!window.confirm("데이터 등록을 실행합니다.")) {
      return;
    }

    const targetCellValues = targetColumnRef.current.getCellValues(1);
    await loadData({
      query,
      source: { ...sourceData },
      target: { ...targetData, columns: targetCellValues },
    });
  };

  return (
    <div className="h-100">
      <Splitter className="h-100">
        <SplitterPanel size={50} className="p-1">
          <ConnectionStoreProvider name="sqlLoader.source">
            <div className="w-100 h-100">
              <div className="h-50 d-flex flex-column">
                <div className="mb-1">
                  <ConnectionForm
                    onChange={(connInfo: ConnInfo) =>
                      setSourceData({ ...sourceData, name: connInfo.name })
                    }
                  />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <TablesView
                    name="sqlLoader.source.tableView"
                    onClick={({ item }: any) =>
                      setSourceData({ ...sourceData, owner: item.owner, tableName: item.tableName })
                    }
                  />
                </div>
              </div>
              <div className="h-50 d-flex flex-column">
                <div className="flex-grow-1 overflow-hidden">
                  <EditableTableColumns
                    ref={sourceColumnRef}
                    filter={{ owner: sourceData.owner, tableName: sourceData.tableName }}
                  />
                </div>
                <div className="text-end mt-1">
                  <Button
                    label="생성"
                    size="small"
                    onClick={(e) => {
                      const sourceCellValues = sourceColumnRef.current.getCellValues(1);
                      const sourceColumns = sourceCellValues.join(",\r\n       ");
                      const generatedQuery = `select ${sourceColumns}\r\n  from ${sourceData.owner}.${sourceData.tableName}`;

                      setQuery(generatedQuery);
                    }}
                  />
                </div>
                <div style={{ height: "250px", minHeight: "150px" }}>
                  <textarea
                    className="form-control w-100 h-100"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </ConnectionStoreProvider>
        </SplitterPanel>
        <SplitterPanel size={50} className="p-1">
          <div className="w-100 h-100">
            <ConnectionStoreProvider name="sqlLoader.target">
              <div className="h-50 d-flex flex-column">
                <div className="mb-1">
                  <ConnectionForm
                    onChange={(connInfo: ConnInfo) =>
                      setTargetData({ ...targetData, name: connInfo.name })
                    }
                  />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <TablesView
                    name="sqlLoader.target.tableView"
                    onClick={({ item }: any) =>
                      setTargetData({ ...targetData, owner: item.owner, tableName: item.tableName })
                    }
                  />
                </div>
              </div>
              <div className="h-50 overflow-hidden">
                <EditableTableColumns
                  ref={targetColumnRef}
                  filter={{ owner: targetData.owner, tableName: targetData.tableName }}
                  editable={false}
                />
              </div>
            </ConnectionStoreProvider>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
};

export default DataLoader;
