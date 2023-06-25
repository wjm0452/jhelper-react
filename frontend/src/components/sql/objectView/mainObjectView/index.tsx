import React from "react";
import httpClient from "../../../../common/httpClient";

export default class MainObjectView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      tabIndex: 0,
      tableName: "",
    };
  }

  render() {
    return <div></div>;
  }
}
