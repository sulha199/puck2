import {
  Puck,
  FieldLabel,
  type FieldRenderFunctions,
  useGetPuck,
  type FieldProps,
  type Data,
  type DefaultComponents,
  type DefaultComponentProps,
  type DefaultRootFieldProps,
  type OnAction,
  AutoField,
  ActionBar,
  type SelectField,
} from '@measured/puck'
import {} from '@measured/puck'
import editorStyles from '@measured/puck/puck.css?url'
import { delayFn } from 'lib/shared/utils'
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FC,
  type ReactNode,
  type JSX,
  memo,
  type PropsWithChildren,
  useCallback,
} from 'react'
import { useDebounceCallback, useIntersectionObserver, useTimeout } from 'usehooks-ts'
import { PuckCkEditor } from '../EditorRichText/CkEditor/CkEditor'
import { FieldTypeContainer, type FieldTypeContainerAdditionalProps } from './PuckEditor.ui.util'
import {
  type GetPuckFn,
  getPuckComponentNameAsLabel,
  getUIEditorPuckConfig,
  selectParentComponent,
} from './PuckEditor.util'
import {
  type AzavistaPuckMainComponent,
  type AzavistaPuckComponent,
  type PuckEditorProps,
  type PuckEditorMetadata,
  type ChildProps,
} from './type'
import './PuckEditor.scss'
import type { Asset } from 'lib/shared/types'
import CkEditorPluginMergeFields from '../EditorRichText/CkEditor/CkEditor.plugin.MergeFields'

export type PuckEditorEditorProps = {
  assets: Asset[]
  assetsDefaultBaseUrl: string
  onPublish: (data: Data<DefaultComponents, DefaultComponentProps & DefaultRootFieldProps>) => void
  onAction?: OnAction<Data<DefaultComponents, DefaultComponentProps & DefaultRootFieldProps>>
  onLanguageChange: (language: string) => void
  isDebug: boolean
  inlineRTEEnabled: boolean;
}

export type PuckEditorEditorMetadataProps<Props extends {} = {}> = PuckEditorMetadata<Props> &
  Pick<PuckEditorEditorProps, 'assets' | 'assetsDefaultBaseUrl' | 'inlineRTEEnabled'>

export const PuckEditor = memo(function <
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number, ChildProps<ChildComponentMap>> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
  Metadata extends PuckEditorMetadata<{}>,
>(props: PuckEditorProps<MainComponentMap, ChildComponentMap, CategoryName, Metadata> & PuckEditorEditorProps) {
  const {
    childComponentMap,
    contentData,
    mainComponentMap,
    styleUrls,
    categories,
    onPublish,
    isDebug,
    metadata,
    assets,
    assetsDefaultBaseUrl,
    onLanguageChange,
    inlineRTEEnabled,
  } = props

  const allComponents = useMemo(
    () => ({
      ...childComponentMap,
      ...mainComponentMap,
    }),
    [childComponentMap, mainComponentMap]
  )
  const allComponentsName = useMemo(() => Object.keys(allComponents), [allComponents])
  const puckConfig = useMemo(() => getUIEditorPuckConfig(props), [mainComponentMap, childComponentMap, categories])

  const [isReadOnly, setIsReadOnly] = useState(false)
  const iframeRef = useRef<Document>(null)
  const outlinesDivRef = useRef<HTMLDivElement>(null)
  const getPuckFnRef = useRef<GetPuckFn<any>>(null)
  const updateOutline = useCallback(
    (getPuck: GetPuckFn<any>) => {
      const attrComponentId = 'data-puck-outline-component-id'
      const attrComponentType = 'data-puck-outline-component-type'
      const {
        appState: {
          data: { content },
        },
      } = getPuck()
      const outlineItemEls = Array.from(
        outlinesDivRef.current?.querySelectorAll<HTMLLIElement>(':scope > ul > li') || []
      )
      outlineItemEls.forEach((el, index) => {
        const component = content?.[index]
        const propsId = component.props.id || ''
        if (el.getAttribute(attrComponentId) !== propsId) {
          el.setAttribute(attrComponentId, propsId)
          el.setAttribute(attrComponentType, component.type)
        }

        const componentName = getPuckComponentNameAsLabel(propsId, getPuck)
        if (componentName) {
          el.querySelector('[class*="Layer-name"]')!.innerHTML = componentName
        }
      })
    },
    [outlinesDivRef.current]
  )

  useEffect(() => {    
    CkEditorPluginMergeFields.dictionary = metadata.dictionary
    CkEditorPluginMergeFields.participantFields = metadata.participantFields
  }, [metadata.dictionary, metadata.participantFields])

  const updateOutlineDebounced = useDebounceCallback(updateOutline, 500)

  const editorMetadata = {
    ...metadata,
    assets,
    assetsDefaultBaseUrl,
    inlineRTEEnabled,
  } as PuckEditorEditorMetadataProps<{}>

  function CommonFieldRenderer<
    T extends string,
    FieldType extends {
      type: T
    },
    Props extends FieldProps<FieldType, any> &
      FieldTypeContainerAdditionalProps & {
        children?: ReactNode | undefined
        DefaultRenderer: FC<Props> | undefined
      },
  >(props: Props): JSX.Element {
    const { id, name, DefaultRenderer } = props

    const customRendererComponentsName = allComponentsName.find((componentName) => id?.startsWith(`${componentName}-`))
    if (customRendererComponentsName) {
      const CustomRenderer = allComponents[customRendererComponentsName]?.overridePropField?.[name]
      if (CustomRenderer) {
        return <CustomRenderer {...(props as any)} />
      }
    }

    const AlternateRenderer = useMemo(() => DefaultRenderer ?? FieldTypeContainer, [DefaultRenderer])
    return <AlternateRenderer {...props}></AlternateRenderer>
  }

  const CustomHeaderActions = useCallback(
    ({ children }: PropsWithChildren) => {
      const languageField: SelectField = {
        label: 'Language',
        type: 'select',
        options: metadata.languages.map((language) => ({
          ...language,
          value: language.id,
        })),
      }
      return (
        <div className='puck__header__actions aza-cmp-flex-row'>
          <AutoField field={languageField} value={metadata.selectedLanguage} onChange={onLanguageChange} />
          <div className='aza-cmp-half-padding'></div>
          {children}
        </div>
      )
    },
    [metadata.languages, onLanguageChange, metadata.selectedLanguage]
  )

  return (
    <>
      <link rel='stylesheet' href={editorStyles} id='puck-css' />
      <Puck
        config={puckConfig as any}
        data={contentData}
        ui={{
          previewMode: isReadOnly ? 'interactive' : 'edit',
        }}
        metadata={editorMetadata}
        overrides={{
          fieldTypes: {
            textarea: memo(
              (props) => {
                const { isIntersecting, ref } = useIntersectionObserver({
                  threshold: 0.5,
                })
                return (
                  <div ref={ref}>
                    <CommonFieldRenderer
                      {...props}
                      metadata={editorMetadata}
                      DefaultRenderer={memo(() => {
                        return (
                          <FieldTypeContainer {...props} metadata={editorMetadata}>
                            {props.field.label && <FieldLabel label={props.field.label} />}
                            {useMemo(() => {
                              return (
                                isIntersecting && (
                                  <PuckCkEditor
                                    {...props}
                                    parentId={`${props.id || ''}__${props.name}_${props.field.type}`}
                                  />
                                )
                              )
                            }, [isIntersecting, props.value, props.onChange])}{' '}
                          </FieldTypeContainer>
                        )
                      })}
                    />
                  </div>
                )
              },
              () => true
            ),

            text: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            array: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            external: (props) => (
              <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />
            ),
            number: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            object: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            radio: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            select: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
            slot: (props) => <CommonFieldRenderer {...props} DefaultRenderer={undefined} metadata={editorMetadata} />,
          } satisfies FieldRenderFunctions,
          actionBar: (props) => {
            let { children, parentAction, label } = props
            const getPuck = useGetPuck() as any as GetPuckFn<any>
            const { selectedItem } = getPuck()
            const selectedItemId: string | undefined = selectedItem?.props.id
            label = selectedItemId ? getPuckComponentNameAsLabel(selectedItemId, getPuck) : label
            return (
              <ActionBar>
                <ActionBar.Group>
                  {parentAction}
                  {label && <ActionBar.Label label={label} />}
                </ActionBar.Group>
                <ActionBar.Group>{children}</ActionBar.Group>
              </ActionBar>
            )
          },
          drawer: (props) => {
            const { children } = props

            if (Array.isArray(children)) {
              return children.filter((chd) => chd?.key !== 'other') as any
            }
            return <>{props.children}</>
          },
          fields: (props) => {
            const { children } = props
            const getPuck = useGetPuck() as any as GetPuckFn<any>

            const { selectedItem } = getPuck()
            const type = selectedItem?.type || 'Nothing'

            const className = `puck-fields`
            const classNameWithType = `${className}--type_${type}`

            const selectParentSection = () => {
              return selectedItem?.props.id && selectParentComponent(selectedItem.props.id, getPuck)
            }

            const shouldDisplayPopup = !!allComponents[type]?.overrideFieldsWrapper?.shouldDisplayPopup
            const popupClassname = shouldDisplayPopup ? `${className}--popup-element` : ''

            return (
              <div className={`${className} ${classNameWithType} ${popupClassname}`}>
                <div className={`${className}__container`}>
                  {children}
                  {shouldDisplayPopup && (
                    <button onClick={selectParentSection} className={`${className}__close`}>
                      X
                    </button>
                  )}
                </div>
              </div>
            )
          },
          iframe: ({ children, document }) => {
            useEffect(() => {
              if (document) {
                styleUrls.forEach((url) => {
                  const link = document.createElement('link')
                  link.href = url
                  link.rel = 'stylesheet'
                  document.head.appendChild(link)
                })
                iframeRef.current = document
              }
            }, [document])
            return <>{children}</>
          },
          headerActions: CustomHeaderActions,
          outline: ({ children }) => {
            const getPuck = useGetPuck() as any as GetPuckFn<any>
            getPuckFnRef.current = getPuck
            useTimeout(() => {
              updateOutline(getPuck)
            }, 0)
            return (
              <div className='puck-outlines' ref={outlinesDivRef}>
                {children}
              </div>
            )
          },
        }}
        onPublish={async (data) => {
          setIsReadOnly(true)

          if (isDebug) {
            console.log('onPublish', { data })
          }

          onPublish?.(data)
        }}
        onAction={async (action, newState, prevState) => {
          const getPuck = getPuckFnRef.current != null ? getPuckFnRef.current : undefined
          if (isDebug) {
            const getActionId = () => {
              switch (action.type) {
                case 'replace': {
                  return action.data.props.id
                }
                case 'insert': {
                  return action.id
                }
                case 'reorder': {
                  return action.destinationZone
                }
                case 'move': {
                  return action.destinationZone
                }
                case 'replaceRoot':
                case 'remove': {
                  return action.type
                }
                case 'duplicate':{
                  return action.sourceZone
                }
                case 'setUi':{
                  return action.type
                }
                case 'set':
                case 'setData':
                case 'registerZone':
                case 'unregisterZone': {
                  return ''
                }
              }
            }
            console.groupCollapsed('onAction', action.type, getActionId())
            console.trace({ action, newState, prevState })
            console.groupEnd()
          }

          if (getPuck) {
            const { selectedItem } = getPuck()
            if (
              action.type === 'setData' ||
              (action.type === 'replace' && action.data.props?.id === selectedItem?.props?.id)
            ) {
              updateOutlineDebounced(getPuck)
            }
          }
        }}
      />
    </>
  )
})
