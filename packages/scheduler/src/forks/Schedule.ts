export const scheduleCallBack = (callback: IdleRequestCallback) => {
  requestIdleCallback(callback)
}
