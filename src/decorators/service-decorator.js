/**
 * Created by perry on 2017/4/13.
 */
const transaction = async (target, key, descriptor) => {
  const fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@transaction can only be used on functions, not: ${fn}`)
  }

  console.log('into decoration transaction with target = ', target, ' key = ', key, ' descriptor = ', descriptor)


}

const decorateArmour = (target, key, descriptor) => {
  const fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@decorateArmour can only be used on functions, not: ${fn}`)
  }

  console.log('into decorator decorateArmour with target = ', target, ' key = ', key, ' descriptor = ', descriptor)

  let moreDef = 100

  descriptor.value = (...args) => {
    args[0] += moreDef
    return fn.apply(target, args)
  }

  return descriptor
}

export {transaction, decorateArmour}
