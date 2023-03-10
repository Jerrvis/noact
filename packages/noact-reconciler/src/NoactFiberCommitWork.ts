import {
  appendBefore,
  appendChild
} from 'noact-dom-bindings/src/client/NoactDOMHostConfig'
import { FiberNode } from './NoactFiber'
import { MutationMask, Placement } from './NoactFiberFlags'
import { FiberRootNode } from './NoactFiberRoot'
import { HostComponent, HostRoot, HostText } from './NoactWorkTags'

const recursivelyTraverseMutationEffect = (
  root: FiberRootNode,
  parentFiber: FiberNode
) => {
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root)
      child = child.sibling
    }
  }
}

const commitReconciliationEffect = (finshedWork: FiberNode) => {
  const { flags } = finshedWork
  // 如果要进行插入操作
  if (flags & Placement) {
    // 把此fiber 的 dom 插入到父真实节点上
    commitPlacement(finshedWork)
    // 删除Placement
    finshedWork.flags & ~Placement
  }
}

const isHostParent = (fiber: FiberNode): boolean => {
  return fiber.tag === HostComponent || fiber.tag == HostRoot
}

const getHostParentFiber = (fiber: FiberNode): FiberNode => {
  let parent = fiber.return as FiberNode
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent
    }
    parent = parent.return as FiberNode
  }
  return parent
}

/**
 * @description: 找到要插入的锚点
 * @param {FiberNode} fiber
 * @return {any} DOM
 */
const getHostSibling = (finfishedWork: FiberNode) => {
  let node: FiberNode = finfishedWork
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }
    node = node.sibling
    // 如果不是原生也不是文本节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果此节点是一个要插入的新节点，找它的弟弟
      if (node.flags & Placement) {
        continue siblings
      } else if (node.child !== null) {
        node = node.child
      }
    }
    if (!(node.flags & Placement)) {
      return node.stateNode
    }
  }
}

/**
 * @description: 把此fiber 的 dom 插入到父 dom
 * @param {FiberNode} finfishedWork
 */
const commitPlacement = (finfishedWork: FiberNode) => {
  let parentFiber = getHostParentFiber(finfishedWork)
  switch (parentFiber.tag) {
    case HostComponent: {
      const parent = parentFiber.stateNode
      const before = getHostSibling(finfishedWork)
      insertOrAppendPlacementNode(finfishedWork, parent, before)
      break
    }
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo
      const before = getHostSibling(finfishedWork)
      insertOrAppendPlacementNode(finfishedWork, parent, before)
      break
    }
    default:
      break
  }
}

/**
 * @description:
 * @param {FiberNode} node 将要插入的fiber节点
 * @param {any} parent 父亲真实节点 dom
 */
const insertOrAppendPlacementNode = (
  node: FiberNode,
  parent: any,
  before?: any
) => {
  const { tag } = node
  const isHost = tag == HostComponent || tag == HostText
  // 如果是真实dom 直接插入 (fragment forwardref 这种就不是)
  if (isHost) {
    const { stateNode } = node
    if (before !== null) {
      appendBefore(parent, stateNode, before)
    } else {
      appendChild(parent, stateNode)
    }
  } else {
    // 不是真实dom (fragment forwardref hoc组件) 查找子dom插入
    const { child } = node
    if (child !== null) {
      insertOrAppendPlacementNode(node, parent)
      let { sibling } = child
      while (sibling !== null) {
        insertOrAppendPlacementNode(node, parent)
        sibling = sibling.sibling
      }
    }
  }
}

export const commitMutationEffectsOnFiber = (
  finishedwork: FiberNode,
  root: FiberRootNode
) => {
  switch (finishedwork.tag) {
    case HostRoot:
    case HostComponent:
    case HostText: {
      // 遍历子节点 ， 处理子节点上的副作用
      recursivelyTraverseMutationEffect(root, finishedwork)
      // 处理自己的副作用
      commitReconciliationEffect(finishedwork)
      break
    }
  }
}
