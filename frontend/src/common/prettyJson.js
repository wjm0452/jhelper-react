export default function prettyJson(obj) {
  if (typeof obj == "string") {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }

  return objectToString(obj, 1);
}

function emptySpace(depth) {
  var result = "";
  for (var i = 0; i < depth; i++) {
    result += "    ";
  }

  return result;
}

function objectToString(obj, depth) {
  let prefix = "{",
    suffix = "}";

  const array = [];

  if (Array.isArray(obj)) {
    prefix = "[";
    suffix = "]";
    obj.forEach((item) => {
      array.push(
        item != null && typeof item == "object" ?
        objectToString(item, depth + 1) :
        jsonValue(item)
      );
    });
  } else {
    for (const [k, v] of Object.entries(obj)) {
      array.push(
        `"${k}": ${
          v != null && typeof v == "object"
            ? objectToString(v, depth + 1)
            : jsonValue(v)
        }`
      );
    }
  }

  let printText = array.join(",\n" + emptySpace(depth));

  return (
    prefix +
    "\n" +
    emptySpace(depth) +
    printText +
    "\n" +
    emptySpace(depth - 1) +
    suffix
  );
}

function jsonValue(value) {
  if (typeof value == "string") {
    return `"${value}"`;
  }

  return value;
}