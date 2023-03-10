import { createHostRootFiber, FiberNode } from './NoactFiber'
import { initialUpdateQueue } from './NoactFiberClassUpdateQueue'

export class FiberRootNode {
  containerInfo: HTMLElement
  current: FiberNode | null
  finishedwork: FiberNode | null
  constructor(containerInfo: HTMLElement) {
    this.containerInfo = containerInfo
    this.current = null
    this.finishedwork = null
  }
}

export const createFiberRoot = (containerInfo: HTMLElement): FiberRootNode => {
  const root = new FiberRootNode(containerInfo)
  // hostRoot 指的是根节点 div #root
  const uninitializedFiber = createHostRootFiber()
  // 项目根容器 指向 根fiber
  root.current = uninitializedFiber as FiberNode
  uninitializedFiber.stateNode = root

  initialUpdateQueue(uninitializedFiber)
  return root
}
