import { registerOverlayPortal, walkTree, type FieldTransformFnParams, type TextareaField } from '@measured/puck'
import { dictionary, type Language } from 'lib/shared/data'
import { useMemo, useState, type FC, type HTMLAttributes, type PropsWithChildren, type ReactElement } from 'react'
import { PuckCkEditor } from '../EditorRichText/CkEditor/CkEditor'
import { InlineEditor } from 'ckeditor5'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { getReplacedContentWithMergeTags } from './RendererTextArea.utils'
import { RENDERER_TEXTAREA_SAVE_TEXT_DEBOUNCE } from 'lib/shared/const'
import { updateComponentData, useGetPuckAnyWhere } from '../puck-editor.util'

export type RendererTextAreaAttrProps = {
  content: string
  useTranslation: 0 | 1
  contentTranslations: {
    [lang in Language]: string
  }
  name?: string
}

export type RendererTextAreaInternalProps = {
  elementAttrs: HTMLAttributes<HTMLDivElement>
  lang: Language
  selectedContent: string
  params: URLSearchParams
}

export const RendererTextArea = (props: RendererTextAreaAttrProps) => {
  const getPuck = useGetPuckAnyWhere()
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

  const elementAttrs: HTMLAttributes<HTMLDivElement> = {
    ...({ 'data-field-type': fieldType, 'data-field-name': fieldName } as any),
    'data-editing': isPuckEditing ? '' : null,
    'data-lang': lang || null,
  }

  return isPuckEditing ? (
    <RendererTextAreaDivEditor
      elementAttrs={elementAttrs}
      lang={lang}
      selectedContent={selectedContent}
      params={params}
      {...props}
    />
  ) : (
    <RendererTextAreaDivReadonly
      elementAttrs={elementAttrs}
      lang={lang}
      selectedContent={selectedContent}
      params={params}
      {...props}
    />
  )
}

export const RendererTextAreaDivReadonly = ({
  elementAttrs,
  lang,
  params,
  selectedContent,
}: RendererTextAreaAttrProps & RendererTextAreaInternalProps) => {
  let replacedContent = getReplacedContentWithMergeTags(selectedContent, params, lang)
  elementAttrs = {
    ...elementAttrs,
    dangerouslySetInnerHTML: { __html: replacedContent },
  }

  return <RendererTextAreaDivEl elementAttrs={elementAttrs} />
}

export const RendererTextAreaDivEditor = (props: RendererTextAreaAttrProps & RendererTextAreaInternalProps) => {
  const getPuck = useGetPuckAnyWhere()
  const [isFocussed, setIsFocussed] = useState(false)
  const [isShowPopupButton] = useDebounceValue(isFocussed, 500)
  const { elementAttrs, lang, selectedContent, useTranslation, contentTranslations } = props
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
  const propsId = (props as any).id as string
  const setTextValue = getPuck
    ? (value: string) => {
        if (propsId && getPuck().selectedItem?.props.id !== propsId) {
          updateComponentData(
            propsId,
            'RendererTextArea',
            (prev) => {
              if (prev.useTranslation) {                
                prev.contentTranslations = {
                  ...prev.contentTranslations,
                  [lang]: value
                }
              } else {
                prev.content = value
              }
              return prev
            },
            getPuck
          )
        }
      }
    : undefined
  const setTextValueDebounced = setTextValue && useDebounceCallback(setTextValue, RENDERER_TEXTAREA_SAVE_TEXT_DEBOUNCE)

  const editorPopupChildren = useMemo(() => {
    if (!getPuck) {
      return undefined
    }

    return (
      <div className='component__renderer-field__textarea-popup'>
        {!isContentLanguageSet && <span className='component__renderer-field__textarea-popup__alert'></span>}
        {isShowPopupButton && (
          <button className='component__renderer-field__textarea-popup__button'>Edit Translations</button>
        )}
      </div>
    )
  }, [getPuck, isContentLanguageSet, isShowPopupButton])

  const editorChildren = useMemo(() => {
    if (!getPuck) {
      return undefined
    }
    return setTextValueDebounced ? (
      <>
        <PuckCkEditor
          editor={InlineEditor as any}
          onChange={setTextValueDebounced}
          value={selectedContent}
          onFocus={() => setIsFocussed(true)}
          onBlur={() => setIsFocussed(false)}
        />
      </>
    ) : undefined
  }, [setTextValueDebounced, getPuck, selectedContent, isFocussed])

  return (
    <>
      {editorPopupChildren}
      <RendererTextAreaDivEl elementAttrs={elementAttrs}>{editorChildren}</RendererTextAreaDivEl>
    </>
  )
}

const RendererTextAreaDivEl: FC<PropsWithChildren<{ elementAttrs: HTMLAttributes<HTMLDivElement> }>> = ({
  elementAttrs,
  children,
}) => {
  return (
    <div
      className='component__renderer-field__textarea'
      ref={(ref) => registerOverlayPortal(ref)}
      {...elementAttrs}
      children={children}></div>
  )
}
