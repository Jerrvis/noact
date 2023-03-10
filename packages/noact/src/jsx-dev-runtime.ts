import { NOACT_ELEMENT_TYPE } from 'shared/NoactSymbols'
import { Key, Ref, Props, ElementType, NoactElement } from 'shared/NoactTypes'

export const jsxDEV = (type: ElementType, config: any): NoactElement => {
  let key: Key = null
  const props: Props = {}
  let ref: Ref = null

  for (const prop in config) {
    const value = config[prop]

    if (prop === 'key') {
      if (value !== undefined) {
        key = '' + value
      }
      continue
    } else if (prop === 'ref') {
      if (value !== undefined) {
        ref = value
      }
      continue
    } else if (config.hasOwnProperty(prop)) {
      props[prop] = value
    }
  }

  return {
    $$typeof: NOACT_ELEMENT_TYPE,
    key,
    type,
    ref,
    props
  } as NoactElement
}
