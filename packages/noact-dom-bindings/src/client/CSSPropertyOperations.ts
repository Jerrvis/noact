export const setValueForStyle = (domElement: HTMLElement, styles: any) => {
  const style = domElement.style
  for (let styleName in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, styleName)) {
      const styleValue = styles[styleName]
      style[styleName] = styleValue
    }
  }
}
