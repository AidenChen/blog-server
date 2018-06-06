/**
 * 获取随机字符串
 * @param randomFlag 是否任意长度
 * @param min 任意长度最小位
 * @param max 任意长度最大位
 * @returns {string}
 */
exports.getRandomChar = (randomFlag, min, max) => {
  let str = ''
  let range = min
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
