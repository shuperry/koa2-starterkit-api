class StringUtil {
  constructor() {
  }

  static reverse(source) {
    return source.split('').reverse().join('')
  }

  static replaceLast(source, replaceMent, target) {
    return reverse(reverse(source).replace(new RegExp(reverse(replaceMent)), reverse(target)))
  }
}

export default StringUtil
