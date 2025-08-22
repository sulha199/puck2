/**@deprecated */
export const getPuckIframe = (): HTMLIFrameElement | null => {
  return document.querySelector<HTMLIFrameElement>('#preview-frame');
}

/**@deprecated */
export const getPuckIframeDocument = (): Document | null => {
  return getPuckIframe()?.contentDocument || null;
}

/** @deprecated use this `setTimeout` based function carefully to avoid memory-leak. You could use `useTimeout`, `useDebounceValue`, `useDebounceCallback` as better react alternative */
export const delayFn = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}