import TextTokenizer from "./textTokenizer";

export default function prettyXml(obj) {
  return toString(obj, 1);
}

function createXmlTokenizer(text) {
  var cus = {};
  cus["<"] = ">";
  cus['"'] = '"';
  cus["'"] = "'";

  return new TextTokenizer(text, cus);
}

function emptySpace(depth) {
  var result = "";
  for (var i = 0; i < depth; i++) {
    result += "    ";
  }

  return result;
}

function toString(text) {
  var tokenizer = createXmlTokenizer(text);
  var results = [];
  var depth = 0;

  var beforeText = null;
  var beforeTextType = 0; // 1: start, 2: end, 3: text

  while (tokenizer.hasNext()) {
    var str = tokenizer.next();

    if (str.startsWith("</")) {
      depth--;

      if (beforeTextType == 3 && beforeText.length > 50) {
        pushResults(results, "\r\n");
        pushResults(results, emptySpace(depth));
      } else if (beforeTextType == 2) {
        pushResults(results, "\r\n");
        pushResults(results, emptySpace(depth));
      }

      pushResults(results, str);

      beforeText = str;
      beforeTextType = 2;
    } else if (str.startsWith("<")) {
      pushResults(results, "\r\n");
      pushResults(results, emptySpace(depth));
      pushResults(results, str);

      if (!str.endsWith("/>")) {
        depth++;
      }

      beforeText = str;
      beforeTextType = 1;
    } else {
      if (str.length > 50) {
        pushResults(results, "\r\n");
        pushResults(results, emptySpace(depth));
        pushResults(results, str);
      } else {
        pushResults(results, str);
      }

      beforeText = str;
      beforeTextType = 3;
    }
  }

  console.log(results.join(""));
  return results.join("");
}

function pushResults(results, str) {
  if (str.startsWith("<")) {
    str = "&lt;" + str.substring(1);
  }

  if (str.endsWith("<")) {
    str = "&gt;" + str.substring(0, str.length - 1);
  }

  results.push(str);
}
