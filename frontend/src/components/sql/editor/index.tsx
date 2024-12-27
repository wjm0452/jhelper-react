import React, { RefObject } from "react";
import CacheContext from "../../../common/cacheContext";
import TextTokenizer from "../../../common/textTokenizer";
import NodeWalker from "../../../common/nodeWalker";
import domUtils from "../../../common/dom";
import rangeUtils from "../../../common/range";

export default class Editor extends React.Component<any, any> {
  private textarea: any;
  private cacheContext: CacheContext;

  private cacheTimerId: any;
  private wait = false;

  constructor(props: any) {
    super(props);
    this.textarea = React.createRef<any>();
    this.cacheContext = new CacheContext(this);
  }

  public focusLine(node: Node): Node {
    let lineNode = this.getLineNode(node);

    const range = document.createRange();
    range.setStart(lineNode, 0);
    range.setEnd(lineNode, 0);

    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    return lineNode;
  }

  componentDidMount(): void {
    this.cacheContext.getCache("query").then((value: any) => {
      this.textarea.current.innerHTML = value;
    });
  }

  cacheContent() {
    if (this.cacheTimerId) {
      window.clearTimeout(this.cacheTimerId);
    }

    this.cacheTimerId = window.setTimeout(() => {
      this.cacheContext.setCache("query", this.textarea.current.innerHTML);
      this.setState({
        query: this.textarea.current.innerHTML,
      });
      this.cacheTimerId = null;
    }, 500);
  }

  public checkLine() {
    if (this.textarea.current.childNodes.length === 0) {
      this.newLine();
    } else if (this.textarea.current.childNodes.length === 1) {
      const childNode = this.textarea.current.childNodes[0];
      if (childNode instanceof Element && childNode.tagName === "BR") {
        this.removeAll();
        this.newLine();
      }
    }
  }

  public newLine(node?: Node, focus: boolean = false): Node {
    const div = document.createElement("div");
    div.appendChild(document.createElement("br"));

    let lineNode;
    if (node) {
      lineNode = this.getLineNode(node);
      lineNode = this.textarea.current.insertBefore(div, lineNode.nextSibling);
    } else {
      lineNode = this.textarea.current.appendChild(div);
    }

    if (focus) {
      this.focusLine(lineNode);
    }

    return lineNode;
  }

  getLineNode(node: Node): Node {
    const paths: Node[] = domUtils.getPathTo(node, this.textarea.current);

    if (paths.length < 2) {
      return null;
    }

    let lineNode: Node = paths[paths.length - 2];

    if (this.isBlock(lineNode)) {
      return lineNode;
    }

    return null;
  }

  public isBlock(node: Node | string): boolean {
    if (!node) {
      return false;
    }

    const BLOCK_NODE_NAMES = /^(P|DIV|TABLE|UL|OL|H[1-6]|TH|TD)$/i;
    const nodeName: string = node instanceof Node ? node.nodeName : node;
    return BLOCK_NODE_NAMES.test(nodeName);
  }

  public removeAll() {
    while (this.textarea.current.firstChild) {
      this.textarea.current.removeChild(this.textarea.current.firstChild);
    }
  }

  public _removeEmptyNode(node: any, deleteEmptyNode?: boolean) {
    const parentNode = node.parentNode;

    if (domUtils.isTextNode(node)) {
      let index = -1;
      while ((index = node.data.indexOf("\u200B")) > -1) {
        node.deleteData(index, 1);
      }

      if (node.data.length === 0) {
        parentNode.removeChild(node);
      }
    } else {
      let current = node.firstChild;
      let next;
      while (current) {
        next = current.nextSibling;
        if (current.tagName !== "BR") {
          this._removeEmptyNode(current);
        }
        current = next;
      }

      if (deleteEmptyNode !== false && node.childNodes.length === 0) {
        parentNode.removeChild(node);
      }
    }
  }

  public removeEmptyNode() {
    let current = this.textarea.current.firstChild;
    let next;
    while (current) {
      next = current.nextSibling;
      this._removeEmptyNode(current, false);
      current = next;
    }

    if (this.textarea.current.childNodes.length === 0) {
      this.newLine();
    }
  }

  public insertTab() {
    // this.command('input', '\u00A0\u00A0\u00A0\u00A0');
  }

  public setLineOffset(lineNode: Node, offset: number) {
    const walker = new NodeWalker(lineNode, this.textarea.current);
    let tmp = 0;

    while (walker.hasNext()) {
      let node = walker.next();
      if (node.nodeType == Node.TEXT_NODE) {
        let textLength = node.nodeValue.length;

        if (tmp + textLength >= offset) {
          var range = document.createRange();
          var selection: any = window.getSelection();

          range.setStart(node, offset - tmp);

          selection.removeAllRanges();
          selection.addRange(range);

          break;
        }

        tmp += node.nodeValue.length;
      }
    }
  }

  public getLineOffset() {
    const selection = document.getSelection();
    const focusNode = selection.focusNode;
    const focusOffset = selection.focusOffset;

    const lineNode = this.getLineNode(focusNode);

    const walker = new NodeWalker(lineNode, focusNode);
    let offset = 0;

    while (walker.hasNext()) {
      let node = walker.next();
      if (node.nodeType == Node.TEXT_NODE) {
        if (node == focusNode) {
          offset += focusOffset;
        } else {
          offset += node.nodeValue.length;
        }
      }
    }

    return offset;
  }

  public firstChild(node: Node) {
    var child = node;

    while (child.firstChild) {
      child = child.firstChild;
    }

    return child;
  }

  public lastChild(node: Node) {
    var child = node;

    while (child.lastChild) {
      child = child.lastChild;
    }

    return child;
  }

  public getOffset() {
    let textarea = this.textarea.current;
    let range = rangeUtils.getRange();
    const walker = new NodeWalker(textarea.firstChild, this.lastChild(textarea));

    let startContainer = range.startContainer;
    let endContainer = range.endContainer;

    let tmp = 0;
    let start = 0;
    let end = 0;

    while (walker.hasNext()) {
      let node = walker.next();

      if (node.nodeType != Node.TEXT_NODE) {
        continue;
      }

      var length = node.nodeValue.length;

      if (node == startContainer) {
        start = tmp + range.startOffset;
      }

      if (node == endContainer) {
        end = tmp + range.endOffset;
      }

      if (start && end) {
        break;
      }

      tmp += length;
    }

    return [start, end];
  }

  applyStyle(e: React.KeyboardEvent<HTMLDivElement>) {
    const selection = document.getSelection();
    const focusNode = selection.focusNode;

    if (focusNode.nodeType != Node.TEXT_NODE) {
      return;
    }

    const lineNode = this.getLineNode(focusNode);
    const offset = this.getLineOffset();

    try {
      const text = lineNode.textContent;

      while (lineNode.firstChild) {
        lineNode.removeChild(lineNode.firstChild);
      }

      const tokenizer = new TextTokenizer(text);

      while (tokenizer.hasNext()) {
        const token = tokenizer.next();

        let element: any = null;
        let textNode: any = null;

        if (this.isReservedWord(token)) {
          textNode = document.createTextNode(token);
          element = document.createElement("span");
          element.style["color"] = "blue";
          element.appendChild(textNode);
        } else {
          textNode = element = document.createTextNode(token);
        }

        lineNode.appendChild(element);
      }

      this.setLineOffset(lineNode, offset);
    } catch (e) {
      console.error(e);
    }
  }

  isReservedWord(str: string): boolean {
    return /select|from|where|and|or|order|by/i.test(str);
  }

  createSQLTokenizer(sql: string) {
    var cus: any = {};
    cus["/*"] = "*/";
    cus["/*+"] = "*/";
    cus["//"] = "\n";
    cus["'"] = "'";

    return new TextTokenizer(sql, cus);
  }

  getTextNodes(node: Node) {
    const walker = new NodeWalker(node.firstChild, this.lastChild(node));
    const array: Node[] = [];

    while (walker.hasNext()) {
      let next = walker.next();

      if (next.nodeType == next.TEXT_NODE) {
        array.push(next);
      }
    }

    return array;
  }

  getTextLines() {
    const textarea: Node = this.textarea.current;
    const lines: string[] = [];
    let node = textarea.firstChild;

    while (node) {
      const textNodes: Node[] = this.getTextNodes(node);

      if (textNodes && textNodes.length) {
        const line = textNodes.map((node) => node.nodeValue).join("");
        lines.push(line);
      } else {
        lines.push("");
      }

      node = node.nextSibling;
    }

    return lines;
  }

  setRange(startOffset: number, endOffset: number) {
    const textarea = this.textarea.current;
    const textNodes: Node[] = this.getTextNodes(textarea);
    let startNode, endNode;
    let startNodeOffset, endNodeOffset;

    while (textNodes.length) {
      let node: Node = textNodes.shift();
      let length = node.nodeValue.length;

      if (!startNode && startOffset - length <= 0) {
        startNode = node;
        startNodeOffset = startOffset;
      }

      if (!endNode && endOffset - length <= 0) {
        endNode = node;
        endNodeOffset = endOffset;
      }

      startOffset -= length;
      endOffset -= length;
    }

    rangeUtils.setRange(startNode, startNodeOffset, endNode, endNodeOffset);
  }

  getQuery() {
    const lines: string[] = this.getTextLines();
    let [startOffset, endOffset]: number[] = this.getOffset();

    if (startOffset == endOffset) {
      let text = lines.join("");
      let tmp = text.substring(0, startOffset);
      let index = tmp.lastIndexOf(";");

      startOffset = index == -1 ? 0 : index + 1;

      tmp = text.substring(startOffset);
      index = tmp.indexOf(";");

      endOffset = index == -1 ? text.length : index;

      this.setRange(startOffset, endOffset);
    }

    const cloneNodes = rangeUtils.getRange().cloneContents();
    const walker = new NodeWalker(cloneNodes.firstChild, this.lastChild(cloneNodes));

    let sql = "";
    while (walker.hasNext()) {
      const node = walker.next();

      if (node.nodeName == "DIV") {
        sql += "\n";
      } else if (node.nodeType == Node.TEXT_NODE) {
        sql += node.nodeValue;
      }
    }

    sql = sql.trim();

    return sql;
  }

  onSql() {
    if (this.props.onSql) {
      this.props.onSql({
        query: this.getQuery(),
      });
    }
  }

  render() {
    return (
      <div
        className="form-control w-100 h-100 editor"
        contentEditable="true"
        suppressContentEditableWarning
        ref={this.textarea}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.ctrlKey && e.key === "Enter") {
            this.onSql();
          }

          if (e.ctrlKey || e.altKey || e.shiftKey) {
            this.wait = true;
            return;
          }

          this.wait = false;

          if (e.key === "Enter") {
            this.removeEmptyNode();
          } else if (e.key === "Tab") {
            e.preventDefault();
          }
        }}
        onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (this.wait) {
            return;
          }

          if (e.key === "Backspace" || e.key === "delete") {
            this.checkLine();
          } else if (!e.shiftKey && e.key === "Tab") {
            this.insertTab();
          }

          this.applyStyle(e);
          this.cacheContent();
        }}
        onCut={(e) => {
          window.setTimeout(() => {
            this.checkLine();
          }, 0);
        }}
      >
        <div>
          <br />
        </div>
      </div>
    );
  }
}
