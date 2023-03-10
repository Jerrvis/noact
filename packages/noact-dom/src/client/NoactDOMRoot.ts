import {
  createContainer,
  updateContainer
} from 'noact-reconciler/src/NoactFiberReconciler'
import { FiberRootNode } from 'noact-reconciler/src/NoactFiberRoot'
import { NoactElement } from 'shared/NoactTypes'

class NoactDOMRoot {
  _internalRoot: FiberRootNode

  constructor(internalRoot: FiberRootNode) {
    this._internalRoot = internalRoot
  }

  render(children: NoactElement) {
    const root: FiberRootNode = this._internalRoot
    updateContainer(children, root)
  }
}

export const createRoot = (container: HTMLElement): NoactDOMRoot => {
  const root = createContainer(container)
  return new NoactDOMRoot(root)
}
