import React, { ReactNode, RefObject } from "react";
import TextTokenizer from "../../../common/textTokenizer";

export default class Editor extends React.Component<any, any> {
  private sqlElement: RefObject<HTMLTextAreaElement>;

  constructor(props: any) {
    super(props);
    this.sqlElement = React.createRef<HTMLTextAreaElement>();
  }

  createSQLTokenizer(sql: string) {
    var cus: any = {};
    cus["/*"] = "*/";
    cus["/*+"] = "*/";
    cus["//"] = "\n";
    cus["'"] = "'";

    return new TextTokenizer(sql, cus);
  }

  addTextToFirstLine(text: string) {
    var element = this.sqlElement.current;
    var sql = element.value;
    sql = text + "\n" + sql;

    element.value = sql;
  }

  setRangeAtCursorPos() {
    var element = this.sqlElement.current;
    var sql = element.value;

    var tokenizer = this.createSQLTokenizer(sql);

    var selection = element.selectionStart,
      start = 0,
      end = 0,
      pos = 0;

    while (tokenizer.hasNext()) {
      var str = tokenizer.next();

      pos += str.length;

      if (str == ";") {
        if (selection <= pos) {
          end = pos - 1;
          break;
        } else if (pos <= selection) {
          start = pos;
        }
      }

      end = pos;
    }

    if (sql.charAt(start) == "\n") {
      start++;
    }

    element.setSelectionRange(start, end);
  }

  getValueAtCursorPos() {
    var element = this.sqlElement.current;
    var sql = element.value;
    return sql.substring(element.selectionStart, element.selectionEnd);
  }

  reset() {
    this.sqlElement.current.value = "";
  }

  focus() {
    this.sqlElement.current.focus();
  }

  render(): ReactNode {
    return (
      <textarea
        ref={this.sqlElement}
        className="form-control w-100 h-100"
        value={this.props.value}
        onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.ctrlKey && e.key === "Enter") {
            this.props?.onEnter();
          }
        }}
        onBlur={() => {}}
      ></textarea>
    );
  }
}
