import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TableView from "../../common/tableViewer";
import { runSql } from "../api";
import { useConnectionStore, useSearchColumnsStore, useSearchQueryStore } from "../store";
import Editor from "./editor";
import editorUtils from "./editorUtils";

const ExportButtons = () => {
  return (
    <>
      <button
        className="btn btn-primary btn-sm me-1"
        onClick={(e) => {
          // this.exportTo("excel", "sql_result.xlsx");
        }}
      >
        excel
      </button>
      <button
        className="btn btn-primary btn-sm me-1"
        onClick={(e) => {
          // this.exportTo("text", "sql_result.text");
        }}
      >
        text
      </button>
      <button
        className="btn btn-primary btn-sm me-1"
        onClick={(e) => {
          // this.exportTo("json", "sql_result.json");
        }}
      >
        json
      </button>
    </>
  );
};

const SqlResultView = () => {
  const searchQueryStore = useSearchQueryStore();
  return (
    <>
      <TableView
        header={searchQueryStore.sqlResult?.columnNames}
        data={searchQueryStore.sqlResult?.result}
      ></TableView>
      <div
        style={{
          display: searchQueryStore.sqlState ? "" : "none",
          height: "95%",
          backgroundColor: "grey",
          padding: "5px",
          fontWeight: "bold",
        }}
      >
        <div>{searchQueryStore.sqlState}</div>
        <div>{searchQueryStore.errorMessage}</div>
      </div>
    </>
  );
};

const FetchCluase = (props: any) => {
  const searchQueryStore = useSearchQueryStore();
  return (
    <>
      <span className="input-group-text">Fetch Size</span>
      <input
        type="number"
        className="form-control"
        min={-1}
        value={searchQueryStore.fetchSize}
        onChange={(e) => {
          searchQueryStore.put("fetchSize", e.target.valueAsNumber);
        }}
      />
      <button
        className="btn btn-secondary"
        onClick={() => {
          props.clearEditor();
        }}
      >
        clear
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          props.executeSql();
        }}
      >
        run
      </button>
    </>
  );
};

const SqlEditor = forwardRef((props, ref) => {
  const editorRef = useRef<Editor>();
  const connectionStore = useConnectionStore();
  const searchQueryStore = useSearchQueryStore();

  const onSql = async () => {
    editorRef.current.focus();
    await executeSql();
  };

  // sql execute
  const executeSql = async () => {
    editorRef.current.setRangeAtCursorPos();
    const query = editorRef.current.getValueAtCursorPos();

    searchQueryStore.resetQuery();
    searchQueryStore.put("query", query);
    try {
      const sqlResult = await runSql(query, {
        name: connectionStore.name,
        fetchSize: searchQueryStore.fetchSize,
      });
      searchQueryStore.put("sqlResult", sqlResult);
    } catch (e: any) {
      searchQueryStore.put("sqlState", e.sqlState);
      searchQueryStore.put("errorMessage", e.errorMessage);
    }
  };

  const clearEditor = () => {
    editorRef.current.reset();
    editorRef.current.focus();
  };

  const execCommand = async (command: string, data: any) => {
    if ("addSelectQuery" == command) {
      editorRef.current.addTextToFirstLine(
        await editorUtils.makeSelectQuery({
          ...data,
          name: connectionStore.name,
        }),
      );
    } else if ("addInsertQuery" == command) {
      editorRef.current.addTextToFirstLine(
        await editorUtils.makeInsertQuery({
          ...data,
          name: connectionStore.name,
        }),
      );
    } else if ("addUpdateQuery" == command) {
      editorRef.current.addTextToFirstLine(
        await editorUtils.makeUpdateQuery({
          ...data,
          name: connectionStore.name,
        }),
      );
    } else if ("addDeleteQuery" == command) {
      editorRef.current.addTextToFirstLine(
        await editorUtils.makeDeleteQuery({
          ...data,
          name: connectionStore.name,
        }),
      );
    }
  };

  useImperativeHandle(ref, () => ({
    execCommand,
    clearEditor,
  }));

  return (
    <div className="d-flex flex-column h-100 p-2">
      <div className="row g-1">
        <div className="col-auto input-group">
          <FetchCluase executeSql={onSql} clearEditor={clearEditor}></FetchCluase>
        </div>
      </div>
      <div className="flex-grow-1 mt-1">
        <Editor
          ref={editorRef}
          onEnter={() => {
            executeSql();
          }}
        ></Editor>
      </div>
      <div className="mt-1 overflow-auto" style={{ height: "350px" }}>
        <SqlResultView></SqlResultView>
      </div>
      <div>
        <div className="d-inline-block">
          <span>{searchQueryStore.sqlResult.count}</span> fetched rows
        </div>
        <div className="float-end">
          <ExportButtons></ExportButtons>
        </div>
      </div>
    </div>
  );
});

export default SqlEditor;
