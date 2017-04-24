/**
 * Created by perry on 2017/4/13.
 */
const transaction = (target, key, descriptor) => {
  const fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@transaction can only be used on functions, not: ${fn}`)
  }

  descriptor.value = async (...args) => {
    return g_api.sequelize.transaction(async t1 => {
      return await fn.apply(target, args)
    })
  }

  return descriptor
}

const log = ({type, description}) => {
  return (target, key, descriptor) => {
    const fn = descriptor.value

    if (typeof fn !== 'function') {
      throw new SyntaxError(`@transaction can only be used on functions, not: ${fn}`)
    }

    descriptor.value = async (...args) => {
      return g_api.sequelize.transaction(async t1 => {
        return await fn.apply(target, args)
      })
    }

    return descriptor
  }
}

const decorateArmour = (target, key, descriptor) => {
  const fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@decorateArmour can only be used on functions, not: ${fn}`)
  }

  let moreDef = 100

  descriptor.value = (...args) => {
    args[0] += moreDef
    return fn.apply(target, args)
  }

  return descriptor
}

export {transaction, decorateArmour}
