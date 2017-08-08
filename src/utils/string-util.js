class StringUtil {
  constructor() {
  }

  reverse(source) {
    return source.split('').reverse().join('')
  }

  replaceLast(source, replaceMent, target) {
    const _this = this

    return _this.reverse(_this.reverse(source).replace(new RegExp(_this.reverse(replaceMent)), _this.reverse(target)))
  }
}

export default new StringUtil()
