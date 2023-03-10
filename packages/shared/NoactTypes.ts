export type Type = any
export type Props = any
export type Ref = any
export type Key = any

interface ComponentParams {
  props: Props
  [name: string]: any
}

// vdom
export interface NoactElement {
  $$typeof: symbol
  type: Element
  key: Key
  props: Props
  ref: Ref
  __sign: string
}

// 类组件
export type Component = any
// 函数组件
export type FC = (obj: ComponentParams) => NoactElement
// 单文件组件
export type NoactComponent = Component | FC
// 文件组件与vdom
export type Element = NoactComponent | NoactElement
// 文本
export type TextElement = string | number
// 子组件
export type Child = TextElement | Element | Children
// 子组件数组
export type Children = Array<Child>

// 更新
export type Update = {
  payload: {
    element?: Element
  }
  next: Update | null
  tag: Number
}

export type UpdateQueue = {
  shared: {
    pending: Update | null
  }
  pending: Update | null
}
