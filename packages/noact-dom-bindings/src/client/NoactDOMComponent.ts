import { Props, Type } from 'shared/NoactTypes'
import { setValueForStyle } from './CSSPropertyOperations'
import setTextContent from './setTextContent'
import { setValueForProperty } from './DOMPropertyOperations'

const STYLE = 'style'
const CHILDREN = 'children'

const setInitialDOMProperties = (
  domElement: HTMLElement,
  type: Type,
  nextProps: Props
) => {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey]
      if (propKey === STYLE) {
        setValueForStyle(domElement, nextProp)
      } else if (propKey == CHILDREN) {
        if (typeof nextProp == 'string' || typeof nextProp == 'number') {
          setTextContent(domElement, nextProp)
        }
      } else {
        setValueForProperty(domElement, propKey, nextProp)
      }
    }
  }
}

export const setInitialProperties = (
  domElement: HTMLElement,
  type: Type,
  nextProps: Props
) => {
  setInitialDOMProperties(domElement, type, nextProps)
}
