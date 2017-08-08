class StringUtil {
  constructor() {
  }

  static reverse(source) {
    return source.split('').reverse().join('')
  }

  static replaceLast(source, replaceMent, target) {
    return StringUtil.reverse(StringUtil.reverse(source).replace(new RegExp(StringUtil.reverse(replaceMent)), StringUtil.reverse(target)))
  }
}

export default StringUtil
