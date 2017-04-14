/**
 * Created by perry on 2017/4/13.
 */
const transaction = async (target, key, descriptor) => {
  console.log('into decoration transaction with target = ', target,  ' key = ', key,  ' descriptor = ', descriptor)
}

const decorateArmour = (target, key, descriptor) => {
  const method = descriptor.value

  let moreDef = 100
  let ret

  console.log('into decorator decorateArmour with target = ', target, ' key = ', key,  ' descriptor = ', descriptor)

  descriptor.value = (...args)=>{
    args[0] += moreDef
    ret = method.apply(target, args)
    return ret
  }
  return descriptor
}

export {transaction, decorateArmour}
