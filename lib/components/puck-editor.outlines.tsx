import { useEffect, useRef, type FC, type PropsWithChildren } from 'react'
import { getPuckComponentName, type GetPuckFn } from './puck-editor.util'
import { useGetPuck } from '@measured/puck'

export const PuckEditorOutlines: FC<PropsWithChildren> = ({ children }) => {
  const getPuck = useGetPuck() as any as GetPuckFn;
  const divRef = useRef<HTMLDivElement>(null)
  const attrName = 'data-puck-outline-component-id'
  const {
    appState: {
      data: { content },
      ui
    },
    selectedItem,
  } = getPuck()

  useEffect(() => {
    // console.log('outline', [content, selectedItem, ui.field.focus])
    const outlineItemEls = Array.from(divRef.current?.querySelectorAll<HTMLLIElement>(':scope > ul > li') || [])
    outlineItemEls.forEach((el, index) => {
      const propsId = content?.[index].props.id || ''
      el.setAttribute(attrName, propsId)

      const componentName = getPuckComponentName(propsId, getPuck)
      if (componentName) {
        el.querySelector('[class*="Layer-name"]')!.innerHTML = componentName
      }
    })
  }, [content, selectedItem, ui.field.focus])
  
  return (
    <div className='puck-outlines' ref={divRef}>
      {children}
    </div>
  )
}
