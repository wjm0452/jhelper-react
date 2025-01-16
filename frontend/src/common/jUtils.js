const move = (array, fromIndex, toIndex) => {
  let copiedArray = array.slice();

  if (fromIndex == toIndex) {
    return copiedArray;
  } else if (fromIndex < 0 || toIndex < 0) {
    return copiedArray;
  } else if (fromIndex >= array.length || toIndex > array.length - 1) {
    return copiedArray;
  }

  let tmp = copiedArray.splice(fromIndex, 1);
  copiedArray.splice(toIndex, 0, tmp[0]);

  return copiedArray;
};

const jUtils = {};
jUtils.move = move;

export default jUtils;
