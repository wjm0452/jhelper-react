import React from "react";
import axios from "axios";

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
