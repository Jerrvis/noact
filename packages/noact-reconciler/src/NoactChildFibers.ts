import {
  createFiber,
  createFiberFromElement,
  createFiberFromText,
  FiberNode
} from './NoactFiber'
import { NOACT_ELEMENT_TYPE } from 'shared/NoactSymbols'
import { Child, Children, NoactElement } from 'shared/NoactTypes'
import { Placement } from './NoactFiberFlags'
import isArray from 'shared/isArray'
/**
 * @description:
 * @param {boolean} shouldTrackSide 是否跟踪副作用
 * @return {Function}
 */
const createChildReconciler = (shouldTrackSide: boolean) => {
  const reconcileSingleElement = (
    returnFiber: FiberNode,
    element: NoactElement
  ): FiberNode => {
    const created = createFiberFromElement(element)
    created.return = returnFiber
    return created
  }

  const placeSingleChild = (newFiber: FiberNode): FiberNode => {
    // 说明要添加的副作用

    if (shouldTrackSide) {
      // 要在最后提交阶段插入此节点
      newFiber.flags |= Placement
    }
    return newFiber
  }

  const createChild = (
    returnFiber: FiberNode,
    newChild: Child
  ): FiberNode | null => {
    if (
      (newChild !== '' && typeof newChild == 'string') ||
      typeof newChild == 'number'
    ) {
      const created = createFiberFromText(newChild)
      created.return = returnFiber
      return created
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case NOACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild)
          created.return = returnFiber
          return created

        default:
          break
      }
    }
    return null
  }

  const placeChild = (newFiber: FiberNode, newIndex: number) => {
    newFiber.index = newIndex

    if (shouldTrackSide) {
      // 如果fiber 的 flags 有 Placement,说明需要创建真实DOM并插入父容器中
      // 如果初次挂载，则不需要添加 flags
      // 这是会把所有的子节点添加到自己身上
      newFiber.flags |= Placement
    }
  }

  /**
   * @description: 用来遍历列表的子节点
   * @param {FiberNode | null} currentFirstChild
   * @param {FiberNode } returnFiber
   * @param {Children } newChild
   * @return {FiberNode | null}
   */
  const reconcileChildArray = (
    currentFirstChild: FiberNode | null,
    returnFiber: FiberNode,
    newChild: Children
  ): FiberNode | null => {
    // 返回的第一个儿子

    let resultingFirstChild = null
    let previousNewFiber = null
    let newIndex = 0
    for (; newIndex < newChild.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChild[newIndex])
      if (newFiber == null) continue
      placeChild(newFiber, newIndex)
      if (previousNewFiber === null) {
        // 定义大儿子
        resultingFirstChild = newFiber
        // 定义上一个fiber
        previousNewFiber = newFiber
        newFiber.return = returnFiber
      } else {
        previousNewFiber.sibling = newFiber
        previousNewFiber = newFiber
        newFiber.return = returnFiber
      }
    }
    return resultingFirstChild
  }

  /**
   * @description:在此方法中进行dom-diff，用老的子fiber链表和新的虚拟dom进行比较的过程
   * @param {FiberNode} currentFirstChild 老fiber
   * @param {FiberNode} returnFiber 新fiber
   * @param {NoactElement} newChild 新vdom
   * @return {null|FiberNode}
   */
  const reconcileChildFibers = (
    currentFirstChild: FiberNode | null,
    returnFiber: FiberNode,
    newChild: Child
  ) => {
    if (isArray(newChild)) {
      return reconcileChildArray(currentFirstChild, returnFiber, newChild)
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case NOACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, newChild))

        default:
          return placeSingleChild(reconcileSingleElement(returnFiber, newChild))
      }
    }
    return null
  }
  return reconcileChildFibers
}
// 有老fiber 要用跟踪
export const reconcileChildFibers = createChildReconciler(true)
// 没有就不跟踪
export const mountChildFibers = createChildReconciler(false)
