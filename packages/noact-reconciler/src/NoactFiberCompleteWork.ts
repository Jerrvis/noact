import { FiberNode } from './NoactFiber'
import { HostComponent, HostText } from './NoactWorkTags'
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalizeInitialChildren
} from 'noact-dom-bindings/src/client/NoactDOMHostConfig'
import { NoFlags } from './NoactFiberFlags'

/**
 * @description:
 * @param {*} parent 当前完成的fiber 真实节点
 * @param {*} workInProgress 当前fiber
 * @return {*}
 */
const appendAllChildren = (parent: HTMLElement, workInProgress: FiberNode) => {
  let node = workInProgress.child
  while (node) {
    // 如果子节点是原生节点
    if (node.tag == HostComponent || node.tag == HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node = node.child
      continue
    }
    // 当前节点没有弟弟
    while (node.sibling === null) {
      // 回到workInprogress 结束
      if (node.return === workInProgress) {
        return
      }
      // 返回到父节点
      node = node.return as FiberNode
    }
    node = node.sibling
  }
}

/**
 * @description:
 * @param {FiberNode|null} current 老fiber
 * @param {FiberNode} workInProgress 新构建的fiber
 * @return {FiberNode}
 */
export const completeWork = (
  current: FiberNode | null,
  workInProgress: FiberNode
) => {
  console.log('completeWork', workInProgress)
  const newProps = workInProgress.pendingProps
  switch (workInProgress.tag) {
    case HostComponent:
      // 原生节点创建真实DOM节点
      const { type } = workInProgress
      const instance = createInstance(type, newProps, workInProgress)
      workInProgress.stateNode = instance
      // 把子节点添加到自己身上

      appendAllChildren(instance, workInProgress)
      finalizeInitialChildren(instance, type, newProps)

      // 向上冒泡属性
      bubbleProperties(workInProgress)
      break
    case HostText:
      // 创建文本dom
      workInProgress.stateNode = createTextInstance(newProps)
      // 向上冒泡属性
      bubbleProperties(workInProgress)
      break
    default:
      bubbleProperties(workInProgress)
      break
  }
}

// 向上冒泡副作用
const bubbleProperties = (completedWork: FiberNode) => {
  let subtreeFlags = NoFlags
  // 遍历所有fiber 子节点，把所有子节点所有副作用合并
  let child = completedWork.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags
    child = child.sibling
  }
  completedWork.subtreeFlags = subtreeFlags
}
