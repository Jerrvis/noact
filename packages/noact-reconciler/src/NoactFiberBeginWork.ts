import { FiberNode } from './NoactFiber'
import { HostComponent, HostRoot, HostText } from './NoactWorkTags'
import { processUpdateQueue } from './NoactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './NoactChildFibers'
import { NoactElement } from 'shared/NoactTypes'
import { shouldSetTextConetnt } from 'noact-dom-bindings/src/client/NoactDOMHostConfig'
/**
 * @description:
 * @param {FiberNode} current 老fiber
 * @param {FiberNode} workInprogress 新fiber
 * @param {NoactElement} nextChildren 新vdom
 * @return {*}
 */
const reconcileChildren = (
  current: FiberNode | null,
  workInprogress: FiberNode,
  nextChildren: NoactElement
) => {
  // 如果没有老fiber，说明是新建的
  if (current === null) {
    workInprogress.child = mountChildFibers(null, workInprogress, nextChildren)
  } else {
    // 做dom diff 用老fiber 链表与 vdom做比较，进行最小化更新
    workInprogress.child = reconcileChildFibers(
      current.child,
      workInprogress,
      nextChildren
    )
  }
}

/**
 * @description: 根据new vdom 构建新的fiber树
 * @param {FiberNode} current 老fiber
 * @param {FiberNode} workInprogress 新fiber
 * @return {*}
 */
export const beginWork = (
  current: FiberNode | null,
  workInprogress: FiberNode
) => {
  // console.log('beginWork', workInprogress)

  switch (workInprogress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInprogress)
    case HostText:
      return null
    case HostComponent:
      return updateHostComponent(current, workInprogress)
    // return null
    default:
      return null
  }
}

const updateHostRoot = (
  current: FiberNode | null,
  workInprogress: FiberNode
) => {
  //  需要知道它的子dom 获取到子vdom 信息 memorizedState
  processUpdateQueue(workInprogress)
  const nextState = workInprogress.memoizedState
  // nextState 是新的子vdom
  const nextChildren = nextState.element as NoactElement
  // 协调子节点

  reconcileChildren(current, workInprogress, nextChildren)
  return workInprogress.child
}

/**
 * 构建原生组件的子fiber 链表
 * @param {FiberNode}current 老 fiber
 * @param {FiberNode}workInProgress 新 fiber
 * */
const updateHostComponent = (
  current: FiberNode | null,
  workInprogress: FiberNode
) => {
  // 需要知道它的子dom 获取到子vdom 信息 memorizedState
  const { type } = workInprogress

  const { pendingProps: nextProps } = workInprogress
  let nextChildren = nextProps.children

  // 子节点优化
  const isDireactTextChild = shouldSetTextConetnt(nextProps)
  if (isDireactTextChild) {
    nextChildren = null
  }
  reconcileChildren(current, workInprogress, nextChildren)
  return workInprogress.child
}
