export default (domElement: HTMLElement, nextProp: string | number) => {
  domElement.textContent = '' + nextProp
}
