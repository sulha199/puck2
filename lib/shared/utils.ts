export const selectPuckComponentById = (iframeEl: Document, puckComponentId: string): void => {
  const parentElement = iframeEl.querySelector(
    `*[data-puck-component]:has(*[data-puck-component=${puckComponentId}])`
  )
  parentElement?.children?.[0]?.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    })
  )
}

export const getPuckIframe = (): HTMLIFrameElement | null => {
  return document.querySelector<HTMLIFrameElement>('#preview-frame');
}

export const getPuckIframeDocument = (): Document | null => {
  return getPuckIframe()?.contentDocument || null;
}

/** @deprecated use this `setTimeout` based function carefully to avoid memory-leak. You could use `useTimeout`, `useDebounceValue`, `useDebounceCallback` as better react alternative */
export const delayFn = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}