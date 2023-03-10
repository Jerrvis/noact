import * as NoactWorkTags from 'noact-reconciler/src/NoactWorkTags'
import { FiberNode } from 'noact-reconciler/src/NoactFiber'

const NoactWorkTagsMap = new Map()
for (let tag in NoactWorkTags) {
  NoactWorkTagsMap.set(NoactWorkTags[tag] as string, tag)
}
export default (prefix: string, workInprogress: FiberNode) => {
  let tagValue = workInprogress.tag
  let tagName = NoactWorkTagsMap.get(tagValue)
  let str = `${tagName} `
  if (tagName === 'HostComponent') {
    str + ` ${workInprogress.type}`
  } else if (tagName === 'HostText') {
    str + ` ${workInprogress.pendingProps.type}`
  }
  console.log(`${prefix} ${str}`)
  return str
}
