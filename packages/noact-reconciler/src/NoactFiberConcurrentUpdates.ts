import { FiberNode } from './NoactFiber'
import { HostRoot } from './NoactWorkTags'

/**
 * @description:
 * @return {*}
 */
export const markUpdateLaneFromFiberToRoot = (sourceFiber: FiberNode) => {
  let node: FiberNode = sourceFiber
  let parent = sourceFiber.return
  while (parent !== null) {
    node = parent as FiberNode
    parent = sourceFiber.return
  }
  // 直到hostRootFiber 的 return 为 null
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}
