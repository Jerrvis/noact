declare namespace JSX {
  interface Element {
    $$typeof: any
    props: any
    key: any
    type: any
    ref: any
    __sign: any
    [elemName: string]: any
  }
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
