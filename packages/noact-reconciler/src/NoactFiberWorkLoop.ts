import { FiberRootNode } from './NoactFiberRoot'
import { scheduleCallBack } from 'scheduler'
import { createWorkInProgress, FiberNode } from './NoactFiber'
import { beginWork } from './NoactFiberBeginWork'
import { completeWork } from './NoactFiberCompleteWork'
import { MutationMask, NoFlags } from './NoactFiberFlags'
import { commitMutationEffectsOnFiber } from './NoactFiberCommitWork'

// 正要被执行的工作
let workInprogress: FiberNode | null = null

/**
 * @description:
 * @return {FiberRootNode} root
 */
export const scheduleUpdateOnFiber = (root: FiberRootNode) => {
  ensureRootIsScheduled(root)
}

const ensureRootIsScheduled = (root: FiberRootNode) => {
  scheduleCallBack(performConcurrentWorkOnRoot.bind(null, root))
}

/**
 * @description: 根据fiber 构建fiber树，构建dom 插入容器
 * @param {FiberRootNode} root
 * @return {*}
 */
function performConcurrentWorkOnRoot(root: FiberRootNode) {
  // 以同步方法渲染根节点(第一次同步渲染)
  renderRootSync(root)
  // 开始进入提交阶段,开始执行副作用
  const finfishedWork = root.current?.alternate as FiberNode
  root.finishedwork = finfishedWork
  commitRoot(root)
}

const commitRoot = (root: FiberRootNode) => {
  const finishedwork = root.finishedwork as FiberNode
  // 判断有没有副作用
  const subtreeHasEffect =
    (finishedwork.subtreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedwork.flags & MutationMask) !== NoFlags
  // 提交副作用

  if (subtreeHasEffect || rootHasEffect) {
    debugger
    console.log('commitRoot')
    commitMutationEffectsOnFiber(finishedwork, root)
  }
  root.current = finishedwork
}

const prepareFreshStack = (root: FiberRootNode) => {
  if (root.current !== null) {
    workInprogress = createWorkInProgress(root.current, null)
  }
}

const renderRootSync = (root: FiberRootNode) => {
  // 开始构建fiber树
  prepareFreshStack(root)
  workLoopSync()
}

const workLoopSync = () => {
  while (workInprogress !== null) {
    performanUnitOfWork(workInprogress)
  }
}

const performanUnitOfWork = (unitOfWork: FiberNode) => {
  // 获取新fiber 对应的老fiber
  const current = unitOfWork.alternate
  // 完成当前fiber 的子 fiber 链表构建
  const next = beginWork(current, unitOfWork)
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 没有next节点表示当前节点已经完成向下的遍历
    completeUnitOfWork(unitOfWork)
  } else {
    workInprogress = next
  }
}

const completeUnitOfWork = (unitOfWork: FiberNode) => {
  let completedWork: FiberNode | null = unitOfWork
  do {
    const current = completedWork.alternate
    const returnFiber: FiberNode | null = completedWork.return
    // 执行此fiber 的完成工作，如果是原生组件就是创建真实的DOM节点
    completeWork(current, completedWork)
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInprogress = siblingFiber
      return
    }
    // 如果没有弟弟，说明已经到最后一个节点
    completedWork = returnFiber
    workInprogress = returnFiber
  } while (completedWork !== null)
}
