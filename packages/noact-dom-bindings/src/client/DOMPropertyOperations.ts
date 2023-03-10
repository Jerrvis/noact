export const setValueForProperty = (
  domElement: HTMLElement,
  name: string,
  value: any
) => {
  if (value === null) {
    domElement.removeAttribute(name)
  } else {
    domElement.setAttribute(name, value)
  }
}
