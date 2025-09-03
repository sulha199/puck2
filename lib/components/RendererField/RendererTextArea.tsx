import {
  registerOverlayPortal,
  type FieldTransformFnParams,
  type TextareaField,
  type WithId,
  type WithPuckProps,
} from '@measured/puck'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
} from 'react'
import { PuckCkEditor } from '../EditorRichText/CkEditor/CkEditor'
import { InlineEditor } from 'ckeditor5'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { getReplacedContentWithMergeTags } from './RendererTextArea.utils'
import { RENDERER_TEXTAREA_SAVE_TEXT_DEBOUNCE } from 'lib/shared/const'
import {
  getLanguageMap,
  getPuckComponentIdFromFieldId,
  selectParentComponent,
  updateComponentData,
  useGetPuckAnyWhere,
} from '../PuckEditor/PuckEditor.util'
import type { AzavistaPuckComponent, PuckEditorLanguage, PuckEditorMetadata } from '../PuckEditor/type'
import CkEditorPluginMergeFields from '../EditorRichText/CkEditor/CkEditor.plugin.MergeFields'
import { delayFn } from 'lib/shared/utils'

export type RendererTextAreaAttrProps = {
  content: string
  useTranslation: 0 | 1
  contentTranslations: {
    [lang: string]: string
  }
  name?: string
}

export const COMPONENT_DATA_RENDERER_TEXTAREA_DEFAULT: RendererTextAreaAttrProps = {
  content: '',
  useTranslation: 0,
  contentTranslations: {
    en_us: '',
    id_id: '',
  },
}

export type RendererTextAreaInternalProps = {
  elementAttrs: HTMLAttributes<HTMLDivElement>
  lang: string
  selectedContent: string
}

export const RendererTextArea = (props: WithId<WithPuckProps<RendererTextAreaAttrProps>>) => {
  const ckeditorID = useRef(new Date().getTime())
  const { content, useTranslation, contentTranslations, puck } = props
  const getPuck = useGetPuckAnyWhere()
  const isPuckEditing = !!getPuck

  const puckMetadata = puck.metadata as PuckEditorMetadata<{}>
  const lang: string = useMemo(
    () => puckMetadata.selectedLanguage || puckMetadata.languages[0].id,
    [puckMetadata.selectedLanguage]
  )

  const fieldType = useMemo(() => 'textarea', [])
  const fieldName: keyof RendererTextAreaAttrProps = useMemo(
    () => (useTranslation ? 'contentTranslations' : 'content'),
    [useTranslation]
  )

  const selectedContentNode: ReactElement<FieldTransformFnParams<TextareaField>> = useMemo(
    () => (useTranslation ? contentTranslations[lang] : content) as any,
    [useTranslation, content, contentTranslations[lang]]
  )
  const selectedContent: string = useMemo(
    () => (isPuckEditing ? selectedContentNode?.props?.value : selectedContentNode) || '',
    [isPuckEditing, selectedContentNode]
  )

  const elementAttrs: HTMLAttributes<HTMLDivElement> = useMemo(
    () => ({
      ...({ 'data-field-type': fieldType, 'data-field-name': fieldName } as any),
      'data-editing': isPuckEditing ? '' : null,
      'data-lang': lang || null,
    }),
    [fieldName, fieldType, isPuckEditing, lang]
  )

  const renderResult = useMemo(() => {
    return isPuckEditing ? (
      <RendererTextAreaDivEditor elementAttrs={elementAttrs} lang={lang} selectedContent={selectedContent} {...props} />
    ) : (
      <RendererTextAreaDivReadonly
        elementAttrs={elementAttrs}
        lang={lang}
        selectedContent={selectedContent}
        {...props}
      />
    )
  }, [isPuckEditing, lang, elementAttrs, selectedContent])
  return renderResult
}

export const RendererTextAreaDivReadonly = ({
  elementAttrs,
  lang,
  selectedContent,
  puck,
}: WithId<WithPuckProps<RendererTextAreaAttrProps & RendererTextAreaInternalProps>>) => {
  const { dictionary, participant } = puck.metadata as PuckEditorMetadata
  let replacedContent = getReplacedContentWithMergeTags(
    selectedContent,
    { dictionary: true, participant: true },
    lang,
    participant,
    dictionary[lang]
  )
  elementAttrs = {
    ...elementAttrs,
    dangerouslySetInnerHTML: { __html: replacedContent },
  }

  return <RendererTextAreaDivEl elementAttrs={elementAttrs} />
}

export const RendererTextAreaDivEditor = (
  props: WithId<WithPuckProps<RendererTextAreaAttrProps & RendererTextAreaInternalProps>>
) => {
  const getPuck = useGetPuckAnyWhere()
  const [isFocussed, setIsFocussed] = useState(false)
  const [isShowPopupButton] = useDebounceValue(isFocussed, 500)
  const { elementAttrs, lang, selectedContent, useTranslation, contentTranslations, puck } = props
  const puckMetadata = puck.metadata as PuckEditorMetadata
  CkEditorPluginMergeFields.dictionary = puckMetadata.dictionary
  CkEditorPluginMergeFields.participantFields = puckMetadata.participantFields
  const isContentLanguageSet = useMemo(() => {
    const languages = puckMetadata.languages.map(({ id }) => id)
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
                  [lang]: value,
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
        <button className='component__renderer-field__textarea-popup__button'>Edit Translations</button>        
      </div>
    )
  }, [getPuck, isContentLanguageSet, isShowPopupButton])

  const onFocusChange = useCallback(
    async (focusValue: boolean) => {
      setIsFocussed(focusValue)
      if (focusValue) {
        const componentId = getPuckComponentIdFromFieldId(propsId)
        if (componentId && getPuck) {
          await delayFn(300)
          selectParentComponent(componentId, getPuck)
        }
      }
    },
    [getPuck]
  )

  const onFocus = useCallback(async () => {
    await onFocusChange(true)
  }, [onFocusChange])

  const onBlur = useCallback(async () => {
    await onFocusChange(false)
  }, [onFocusChange])

  const editorChildren = useMemo(() => {
    if (!getPuck || !setTextValueDebounced) {
      return undefined
    }
    return (
      <PuckCkEditor
        editor={InlineEditor as any}
        onChange={setTextValueDebounced}
        value={selectedContent}
        onFocus={onFocus}
        onBlur={onBlur}
        parentId={`${propsId}_inlineEditor`}
      />
    )
  }, [setTextValueDebounced, getPuck, selectedContent, isFocussed])

  return (
    <>
      {editorPopupChildren}
      <RendererTextAreaDivEl elementAttrs={{...elementAttrs, onClick: onFocus}}>{editorChildren}</RendererTextAreaDivEl>
    </>
  )
}

const RendererTextAreaDivEl: FC<PropsWithChildren<{ elementAttrs: HTMLAttributes<HTMLDivElement> }>> = ({
  elementAttrs,
  children,
}) => {
  return (
    <div className='component__renderer-field__textarea' ref={registerOverlayPortal} {...elementAttrs}>
      {children}
    </div>
  )
}

export const RendererTextAreaPuckComponent: (
  languages: PuckEditorLanguage[]
) => AzavistaPuckComponent<RendererTextAreaAttrProps> = (languages) => ({
  componentData: {
    label: 'Text Area',
    fields: {
      useTranslation: {
        label: 'Translate',
        type: 'select',
        options: [
          {
            value: 0,
            label: 'no',
          },
          {
            value: 1,
            label: 'yes',
          },
        ],
      },
      content: {
        type: 'textarea',
        label: 'Universal Content',
        contentEditable: true,
      },
      contentTranslations: {
        type: 'object',
        label: 'Language Translations',
        objectFields: getLanguageMap(languages) as any,
      },
    },
    defaultProps: COMPONENT_DATA_RENDERER_TEXTAREA_DEFAULT,
    render: RendererTextArea,
  },
  overrideFieldsWrapper: {
    shouldDisplayPopup: true,
  },
})
