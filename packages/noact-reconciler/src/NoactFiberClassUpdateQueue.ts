import { Update, UpdateQueue } from 'shared/NoactTypes'
import { FiberNode } from './NoactFiber'
import { markUpdateLaneFromFiberToRoot } from './NoactFiberConcurrentUpdates'
import assign from 'shared/assign'
export const UpdateState = 0

export const initialUpdateQueue = (fiber: FiberNode) => {
  // 创建一个新的更新队列
  // pending 其实是一个循环链接
  const queue = {
    shared: {
      pending: null
    },
    pending: null
  } as UpdateQueue
  fiber.updateQueue = queue
}

export const createUpdate = (): Update => {
  const update = {
    tag: UpdateState,
    next: null,
    payload: {}
  }
  return update
}

export const enqueueUpdate = (fiber: FiberNode, update: Update) => {
  const updateQueue = fiber.updateQueue as UpdateQueue

  const pending = updateQueue.pending
  if (pending === null) {
    update.next = update
    updateQueue.pending = update
  } else {
    // pendgin 指向最后一个更新的对象
    update.next = pending.next
    pending.next = update
  }
  updateQueue.shared.pending = update

  // 返回到根节点 FiberRootNode
  return markUpdateLaneFromFiberToRoot(fiber)
}

/**
 * @description: 根据老状态和更新队列中的更新计算最新状态
 * @param {FiberNode} current
 * @param {FiberNode} workInprogress
 * @return {*}
 */
export const processUpdateQueue = (workInprogress: FiberNode) => {
  const queue = workInprogress.updateQueue as UpdateQueue
  const pendginQueue = queue.shared.pending

  // 如果有更新
  if (pendginQueue !== null) {
    // 清除等待更新
    queue.shared.pending = null
    // 获取更新队列中最后一个更新
    const lastPendingUpdate = pendginQueue
    const firstPendingUpdate = lastPendingUpdate.next
    // 剪开环链表，变成单链表
    lastPendingUpdate.next = null
    // 获取老状态 null
    let newState = workInprogress.memoizedState
    let update = firstPendingUpdate
    while (update) {
      // 根据老状态和更新计算新状态
      newState = getStateFromUpdate(update, newState)
      update = update.next
    }
    // 把计算到的状态赋值给 memoizedState
    workInprogress.memoizedState = newState
  }
}

/**
 * @description: 根据老状态更新计算新状态
 * @param {Update} update
 * @param {any} prevState
 * @return {*}
 */
const getStateFromUpdate = (update: Update, prevState: any) => {
  const { payload } = update
  switch (update.tag) {
    case UpdateState:
      return assign({}, prevState, payload)

    default:
      return assign({}, prevState, payload)
  }
}
