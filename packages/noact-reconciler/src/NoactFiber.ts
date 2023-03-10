import { FiberRootNode } from './NoactFiberRoot'
import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent
} from './NoactWorkTags'
import { Props, Key, Type, UpdateQueue, NoactElement } from 'shared/NoactTypes'
import { Flags, NoFlags } from './NoactFiberFlags'
import { DOM } from 'shared/realDOMTypes'

export class FiberNode {
  tag: Number
  key: Key
  type: Type // 节点类型 div h1 p span

  stateNode: any // 对应真实dom 节点

  return: FiberNode | null // 父fiber
  child: FiberNode | null // 子fiber
  sibling: FiberNode | null // 弟弟fiber

  pendingProps: Props
  memoizedProps: Props

  memoizedState: any
  // 更新队列
  updateQueue: UpdateQueue | null

  // 父节点副作用标识，标识对此fiber做什么操作
  flags: Flags
  // 子节点副作用标识
  subtreeFlags: Flags

  // 轮替
  alternate: FiberNode | null
  index: number
  constructor(tag: Number, pendingProps: Props, key: Key) {
    this.tag = tag
    this.pendingProps = pendingProps
    this.key = key

    this.stateNode = null

    this.return = null
    this.child = null
    this.sibling = null

    this.updateQueue = null

    this.flags = NoFlags
    this.subtreeFlags = NoFlags

    this.alternate = null

    this.index = 0
  }
}

export const createFiber = (
  tag: Number,
  pendingProps: Props,
  key: Key
): FiberNode => {
  return new FiberNode(tag, pendingProps, key)
}

export const createHostRootFiber = () => {
  return createFiber(HostRoot, null, null)
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
) => {
  let workInProgress = current.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.type = current.type
    workInProgress.flags = NoFlags
    workInProgress.subtreeFlags = NoFlags
  }
  workInProgress.child = current.child
  workInProgress.memoizedState = current.memoizedState
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.flags = current.flags
  workInProgress.sibling = current.sibling
  workInProgress.updateQueue = current.updateQueue
  return workInProgress
}

/**
 * @description: 根据vdom创建fiber
 * @return {*}
 */
export const createFiberFromElement = (element: NoactElement): FiberNode => {
  const { type, key, props } = element
  return createFiberFromTypeAndProps(type, key, props)
}

/**
 * @description: 根据vdom创建fiber
 * @param {string | number}
 * @return {*}
 */
export const createFiberFromText = (text: string | number): FiberNode => {
  const fiber = createFiber(HostText, '' + text, null)
  return fiber
}

const createFiberFromTypeAndProps = (
  type: Type,
  key: Key,
  props: Props
): FiberNode => {
  let tag = IndeterminateComponent
  // 如果是字符串类型 说明是原生组件
  if (typeof type === 'string') {
    tag = HostComponent
  }
  const fiber = createFiber(tag, props, key)
  fiber.type = type
  return fiber
}
