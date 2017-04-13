const reverse = (source) => {
  return source.split('').reverse().join('')
}

const replaceLast = (source, replaceMent, target) => {
  return reverse(reverse(source).replace(new RegExp(reverse(replaceMent)), reverse(target)))
}

export {reverse, replaceLast}
