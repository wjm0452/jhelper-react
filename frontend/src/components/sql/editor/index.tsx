import React, { RefObject } from "react";
import CacheContext from "../../../common/cacheContext";
import TextTokenizer from "../../../common/textTokenizer";
import NodeWalker from "../../../common/nodeWalker";
import domUtils from "../../../common/dom";
import rangeUtils from "../../../common/range";

export default class Editor extends React.Component<any, any> {
    private textarea: any;
    private cacheContext: CacheContext;

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

    public checkLine() {

        if (this.textarea.current.childNodes.length === 0) {
            this.newLine();
        }
        else if (this.textarea.current.childNodes.length === 1) {

            const childNode = this.textarea.current.childNodes[0];
            if (childNode instanceof Element && childNode.tagName === 'BR') {
                this.removeAll();
                this.newLine();
            }

        }
    }

    public newLine(node?: Node, focus: boolean = false): Node {
        const div = document.createElement('div');
        div.appendChild(document.createElement('br'));

        let lineNode;
        if (node) {
            lineNode = this.getLineNode(node);
            lineNode = this.textarea.current.insertBefore(div, lineNode.nextSibling);
        }
        else {
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
                if (current.tagName !== 'BR') {
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
                    var range = document.createRange()
                    var selection: any = window.getSelection()

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
                }
                else {
                    offset += node.nodeValue.length;
                }
            }
        }

        return offset;
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
        let range = rangeUtils.getRange()
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
                    textNode = document.createTextNode(token)
                    element = document.createElement("span");
                    element.style['color'] = 'blue';
                    element.appendChild(textNode);
                }
                else {
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

    getText(start: number, end: number) {
        const textarea = this.textarea.current;
        const walker = new NodeWalker(textarea.firstChild, this.lastChild(textarea));

        let result = '';
        let addStartPos = 0;
        let addEndPos = 0;

        while (walker.hasNext()) {
            let next = walker.next();

            if (next.nodeName == 'DIV') {
                result += '\n';

                if (addStartPos) {
                    addStartPos++;
                }
                addStartPos++;
            }
            else if (next.TEXT_NODE == next.TEXT_NODE) {
                let value = next.nodeValue;
                result += value;

                if (result.length >= addStartPos) {

                }

            }
        }

        return result;
    }

    getTextArray() {
        return this.getTextNodes().map((node) => {
            return node.nodeValue;
        });
    }

    getTextNodes() {
        const textarea = this.textarea.current;
        const walker = new NodeWalker(textarea.firstChild, this.lastChild(textarea));
        const array = [];

        while (walker.hasNext()) {
            let next = walker.next();

            if (next.TEXT_NODE == next.TEXT_NODE) {
                array.push(next);
            }
        }

        return array;
    }

    onSql() {

        // console.log(selection.getRangeAt(0).cloneContents().textContent);

        const offset = this.getOffset();
        let start = offset[0], end = offset[1];
        let textArray = this.getTextArray();
        let sql = '';

        if (start == end) {

            start = end = 0;

            let tokenizer = this.createSQLTokenizer(sql);
            var selection = offset[0],
                pos = 0;

            while (tokenizer.hasNext()) {
                var str = tokenizer.next();

                pos += str.length;

                if (str == ";") {
                    if (selection <= pos) {
                        end = pos;
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
        }

        console.log(start, end)
        console.log(sql);
        console.log(sql.substring(start, end));

        // element.setSelectionRange(start, end);

        // this.runSql(sql.substring(start, end));
    }

    render() {
        return (
            <div
                className="form-control w-100 h-100 editor"
                contentEditable="true"
                ref={this.textarea}
                onChange={(e) => {
                    // this.applyStyle(e);

                    // if (this.props.onChange) {
                    //     // this.cacheContext.setCache("query", e.currentTarget.innerHTML);
                    //     this.props.onChange({
                    //         html: e.currentTarget.innerHTML,
                    //         currentTarget: e.currentTarget
                    //     });
                    // }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {

                    if (e.ctrlKey && e.key === "Enter") {
                        this.onSql();
                    }

                    if (e.ctrlKey || e.altKey) {
                        this.wait = true;
                        return;
                    }

                    this.wait = false;

                    if (e.key === 'Enter') {
                        this.removeEmptyNode();
                    }
                    else if (e.key === 'Tab') {
                        e.preventDefault();
                    }
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {

                    if (this.wait) {
                        return;
                    }

                    if (e.key === 'Backspace' || e.key === 'delete') {
                        this.checkLine();
                    }
                    else if (!e.shiftKey && e.key === 'Tab') {
                        this.insertTab();
                    }

                    this.applyStyle(e);
                }}

                onCut={(e) => {
                    window.setTimeout(() => { this.checkLine(); }, 0);
                }}
            >
                <div><br /></div>
            </div>
        );
    }
}
