import React from "react";
import httpClient from "../../../../common/httpClient";
import TableView from "../../tableView";

export default class SubObjectView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      columns: [],
    };
  }

  render() {
    return <div></div>;
  }
}
