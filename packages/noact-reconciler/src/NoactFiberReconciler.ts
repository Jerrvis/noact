import { createFiberRoot, FiberRootNode } from './NoactFiberRoot'
import { createUpdate, enqueueUpdate } from './NoactFiberClassUpdateQueue'
import { FiberNode } from './NoactFiber'
import { scheduleUpdateOnFiber } from './NoactFiberWorkLoop'
import { NoactElement } from 'shared/NoactTypes'

export const createContainer = (containerInfo: HTMLElement): FiberRootNode => {
  return createFiberRoot(containerInfo)
}

export const updateContainer = (
  element: NoactElement,
  container: FiberRootNode
) => {
  // 获取当前的根fiber
  const current = container.current as FiberNode
  // 创建更新
  const update = createUpdate()
  // 要更新的vdom
  update.payload.element = element
  // 把更新对象添加到current的根fiber对象上
  const root = enqueueUpdate(current, update)

  // 调度更新
  if (root != null) {
    scheduleUpdateOnFiber(root)
  }
}
