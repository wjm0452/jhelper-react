import React, { RefObject } from "react";
import Jsql from "../jsql";
import DBTableList from "./dbTableList";
import ColumnMapping from "./columnMapping";

export default class DataLoader extends React.Component<any, any> {
  private jsql: Jsql;

  private sourceColumnRef: RefObject<ColumnMapping>;
  private targetColumnRef: RefObject<ColumnMapping>;

  constructor(props: any) {
    super(props);
    this.jsql = new Jsql({
      url: "/api/sql",
    });

    this.sourceColumnRef = React.createRef<ColumnMapping>();
    this.targetColumnRef = React.createRef<ColumnMapping>();
  }

  render() {
    return (
      <div className="w-100 h-100 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-row">
          <div className="flex-grow-1">
            <DBTableList
              onClick={(source: any) => {
                this.sourceColumnRef.current?.setData(source);
              }}
            />
          </div>
          <div className="flex-grow-1">
            <DBTableList
              onClick={(source: any) => {
                this.targetColumnRef.current?.setData(source);
              }}
            />
          </div>
        </div>
        <div className="flex-grow-1 d-flex flex-row">
          <div className="flex-grow-1">
            <ColumnMapping ref={this.sourceColumnRef}></ColumnMapping>
          </div>
          <div className="flex-grow-1">
            <ColumnMapping ref={this.targetColumnRef}></ColumnMapping>
          </div>
        </div>
      </div>
    );
  }
}
