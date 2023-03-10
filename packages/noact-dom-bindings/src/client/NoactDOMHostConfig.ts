import { FiberNode } from 'noact-reconciler/src/NoactFiber'
import { Props, Type } from 'shared/NoactTypes'
import { setInitialProperties } from './NoactDOMComponent'

export const shouldSetTextConetnt = (props: any) => {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  )
}

export const createTextInstance = (props: Props): Text => {
  return document.createTextNode(props)
}

export const createInstance = (
  type: Type,
  newProps: Props,
  workInProgress: FiberNode
): HTMLElement => {
  const dom = document.createElement(type) as HTMLElement
  // 属性添加

  return dom
}

export const appendInitialChild = (parent: HTMLElement, child: any) => {
  parent.appendChild(child)
}

export const finalizeInitialChildren = (
  domElement: HTMLElement,
  type: Type,
  props: Props
) => {
  setInitialProperties(domElement, type, props)
}

export const appendChild = (parent: any, node: any) => {
  parent.appendChild(node)
}

export const appendBefore = (parent: any, node: any, before: any) => {
  parent.insertBefore(node, before)
}
