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

export function mapRecordProperty<T extends Record<string, any>, P extends keyof T[keyof T]>(
  record: T,
  propertyName: P
): { [itemKey in keyof T]: T[itemKey][P] } {
  return Object.keys(record).reduce(
    (result, key) => ({
      ...result,
      [key]: (record[key] as any)[propertyName],
    }),
    {}
  ) as any
}

/**
 * 
 * @param url full URL or relative-path
 * @param baseUrl base-url to add if the `url` misses the base-url
 * @returns 
 */
export const createUrl = (url: string, baseUrl: string | undefined): string => {
  try {
    return (new URL(url)).href
  } catch (e) {
    return (new URL(url, baseUrl)).href
  }
}
