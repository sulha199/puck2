import {
  registerOverlayPortal,
  useGetPuck,
  walkTree,
  type FieldTransformFnParams,
  type TextareaField,
} from '@measured/puck'
import { dictionary, participant, type Language } from 'lib/shared/data'
import { useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactElement } from 'react'
import { PuckCkEditor } from '../EditorRichText/CkEditor/CkEditor'
import { InlineEditor } from 'ckeditor5'
import { delayFn, getPuckIframe, getPuckIframeDocument } from 'lib/shared/utils'

export type RendererTextAreaAttrProps = {
  content: string
  useTranslation: 0 | 1
  contentTranslations: {
    [lang in Language]: string
  }
}

const useGetPuckAnyWhere = () => {
  try {
    return useGetPuck()
  } catch (e) {
    return null
  }
}

export const RendererTextArea = (props: RendererTextAreaAttrProps) => {
  const getPuck = useGetPuckAnyWhere()
  const [isFocussed, setIsFocussed] = useState(false)
  const [isShowPopupButton, setIsShowPopupButton] = useState(false)
  // const {} = getPuck?.() || {}

  const isPuckEditing = !!getPuck
  const params = new URL(document.location.toString()).searchParams
  const lang: Language = (params.get('lang') as Language) || 'en_us'
  const fieldType = 'textarea'
  const { content, useTranslation, contentTranslations } = props
  const fieldName: keyof RendererTextAreaAttrProps = useTranslation ? 'contentTranslations' : 'content'
  const selectedContentNode: ReactElement<FieldTransformFnParams<TextareaField>> = (
    useTranslation ? contentTranslations[lang] : content
  ) as any
  const selectedContent: string = (isPuckEditing ? selectedContentNode?.props?.value : selectedContentNode) || ''
  // const mergeTags = [...selectedContent.matchAll(/\[\[[^\[]*\]\]/gm)]
  const mergeTags = [...selectedContent.matchAll(/\{\{[^\}]+\}\}/gm)]
  let replacedContent = `${selectedContent}`
  mergeTags.forEach((regexResult) => {
    const tag = regexResult[0]
    const [entity, field] = tag
      // .replaceAll(/(\[{2}|\]{2})/gm, '')
      .replaceAll(/(\{{2}|\}{2})/gm, '')
      .trim()
      .split('.')

    if (params.get(entity) != null) {
      let replacement = `{{${entity}.${field} is unknown}}`
      switch (entity) {
        case 'participant': {
          const fieldValue = (participant as any)[field]
          replacement = fieldValue ?? replacement
        }
        case 'dictionary': {
          const fieldValue = (dictionary[lang] as any)[field]
          replacement = fieldValue ?? replacement
        }
      }
      replacedContent = replacedContent.replaceAll(tag, replacement)
    }
  })
  const elementAttrs: HTMLAttributes<HTMLDivElement> = {
    ...({ 'data-field-type': fieldType, 'data-field-name': fieldName } as any),
    'data-editing': isPuckEditing ? '' : null,
    'data-lang': lang || null,
  }
  if (!isPuckEditing) {
    elementAttrs.dangerouslySetInnerHTML = { __html: replacedContent }
  }

  const setTextValue = isPuckEditing
    ? (value: string) => {
        if (getPuck) {
          const { appState, config, dispatch } = getPuck()
          const newContent = walkTree(appState.data, config, (content) =>
            content.map((child) => {
              if (child.props.id === (props as any).id) {
                const newData = { ...child }
                if (useTranslation) {
                  newData.props.contentTranslations[lang] = value
                } else {
                  newData.props.content = value
                }
                return newData
              } else {
                return child
              }
            })
          )
          dispatch({
            type: 'setData',
            data: newContent,
          })
        }
      }
    : undefined

  const isContentLanguageSet = useMemo(() => {
    const languages = Object.keys(dictionary) as Language[]
    const getInnerText = (content: string) => {
      return content.replace(/<[^>]*>/g, '').trim()
    }
    return (
      !useTranslation ||
      languages.every(
        (lang) =>
          getInnerText((contentTranslations[lang] as any)?.props?.value ?? contentTranslations[lang] ?? '').length > 0
      )
    )
  }, [useTranslation, contentTranslations])

  const editorPopupChildren = useMemo(() => {
    if (!isPuckEditing) {
      return undefined
    }
    const selectSection = () => {
      // return
      const sectionElement = getPuckIframeDocument()?.querySelector(`*[data-puck-component=${(props as any).id}]`)
      sectionElement?.dispatchEvent(
        new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false,
        })
      )
    }
    return (
      <div className='component__renderer-field__textarea-popup'>
        {!isContentLanguageSet && <span className='component__renderer-field__textarea-popup__alert'></span>}
        {isShowPopupButton && (
          <button className='component__renderer-field__textarea-popup__button' onClick={() => selectSection()}>
            Edit Translations
          </button>
        )}
      </div>
    )
  }, [isPuckEditing, isContentLanguageSet, isShowPopupButton])

  const editorChildren = useMemo(() => {
    if (!isPuckEditing) {
      return undefined
    }
    return isPuckEditing && setTextValue ? (
      <>
        <PuckCkEditor
          editor={InlineEditor as any}
          onChange={setTextValue}
          value={selectedContent}
          onFocus={() => setIsFocussed(true)}
          onBlur={() => setIsFocussed(false)}
        />
      </>
    ) : undefined
  }, [setTextValue, isPuckEditing])

  // Register the overlay portal for the textarea component
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => registerOverlayPortal(divRef.current), [divRef.current])
  useEffect(() => {
    ;(async () => {
      if (isFocussed) {
        delayFn(100).then(() => setIsShowPopupButton(true))
      }
      await delayFn(500)
      if (!isFocussed) {
        setIsShowPopupButton(isFocussed)
      }
    })()
  }, [isFocussed])

  return (
    <>
      {editorPopupChildren}
      <div
        className='component__renderer-field__textarea'
        ref={divRef}
        {...elementAttrs}
        children={editorChildren}></div>
    </>
  )
}

