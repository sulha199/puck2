import { Puck, FieldLabel, type FieldRenderFunctions, useGetPuck, type Config, type FieldProps, type Data, type DefaultComponents, type DefaultComponentProps, type DefaultRootFieldProps, type OnAction } from '@measured/puck'
import editorStyles from '@measured/puck/puck.css?url'
import { delayFn } from 'lib/shared/utils'
import { useState, useRef, useEffect, useMemo, type FC, type ReactNode, type JSX } from 'react'
import { useTimeout } from 'usehooks-ts'
import { PuckCkEditor } from '../EditorRichText/CkEditor/CkEditor'
import { FieldTypeContainer } from './PuckEditor.ui.util'
import { type GetPuckFn, getPuckComponentNameToRender, getUIEditorPuckConfig, selectParentComponent } from './PuckEditor.util'
import { type AzavistaPuckMainComponent, type AzavistaPuckComponent, type UIEditorProps, mapRecordProperty, type PuckConfigComponents } from './type'
import './PuckEditor.scss'


export function PuckEditor<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
>(props: UIEditorProps<MainComponentMap, ChildComponentMap, CategoryName> & {
  onPublish: (data: Data<DefaultComponents, DefaultComponentProps & DefaultRootFieldProps>) => void
  onAction?: OnAction<Data<DefaultComponents, DefaultComponentProps & DefaultRootFieldProps>>
  isDebug: boolean;
}) {
  const { childComponentMap, contentData, mainComponentMap, styleUrls, categories, onPublish, isDebug } = props

  const allComponents = useMemo(
    () => ({
      ...childComponentMap,
      ...mainComponentMap,
    }),
    [childComponentMap, mainComponentMap]
  )
  const allComponentsName = useMemo(() => Object.keys(allComponents), [allComponents])
  const puckConfig = useMemo(() => getUIEditorPuckConfig(props), [mainComponentMap, childComponentMap, categories])

  // type PuckConfig = typeof puckConfig;
  type PuckConfig = any;

  const [isReadOnly, setIsReadOnly] = useState(false)
  const iframeRef = useRef<Document>(null)
  const outlinesDivRef = useRef<HTMLDivElement>(null)
  const getPuckFnRef = useRef<GetPuckFn<any>>(null)
  const updateOutline = (getPuck: GetPuckFn<any>) => {
    const attrComponentId = 'data-puck-outline-component-id'
    const attrComponentType = 'data-puck-outline-component-type'
    const {
      appState: {
        data: { content },
      },
    } = getPuck()
    const outlineItemEls = Array.from(outlinesDivRef.current?.querySelectorAll<HTMLLIElement>(':scope > ul > li') || [])
    outlineItemEls.forEach((el, index) => {
      const component = content?.[index]
      const propsId = component.props.id || ''
      el.setAttribute(attrComponentId, propsId)
      el.setAttribute(attrComponentType, component.type)

      const componentName = getPuckComponentNameToRender(propsId, getPuck)
      if (componentName) {
        el.querySelector('[class*="Layer-name"]')!.innerHTML = componentName
      }
    })
  }

  function commonFieldRenderer<
    T extends string,
    FieldType extends {
      type: T
    },
    Props extends FieldProps<FieldType, any> & {
      name: string
    } & {
      children?: ReactNode | undefined
    },
  >(props: Props, DefaultRenderer: FC<Props> = FieldTypeContainer): JSX.Element {
    const { id, name } = props

    const customRendererComponentsName = allComponentsName.find((componentName) => id?.startsWith(`${componentName}-`))
    if (customRendererComponentsName) {
      const customRenderer = allComponents[customRendererComponentsName]?.overridePropField?.[name]
      if (customRenderer) {
        return customRenderer(props as any) as any
      }
    }

    return <DefaultRenderer {...props}></DefaultRenderer>
  }

  return (
    <>
      <link rel='stylesheet' href={editorStyles} id='puck-css' />
      <Puck
        config={puckConfig as any}
        data={contentData}
        ui={{
          previewMode: isReadOnly ? 'interactive' : 'edit',
        }}
        overrides={{
          fieldTypes: {
            textarea: (props) =>
              commonFieldRenderer(props, (props) => (
                <FieldTypeContainer {...props}>
                  {props.field.label && <FieldLabel label={props.field.label} />}
                  <PuckCkEditor {...props} />{' '}
                </FieldTypeContainer>
              )),
            text: commonFieldRenderer,
            array: commonFieldRenderer,
            external: commonFieldRenderer,
            number: commonFieldRenderer,
            object: commonFieldRenderer,
            radio: commonFieldRenderer,
            select: commonFieldRenderer,
            slot: commonFieldRenderer,
          } satisfies FieldRenderFunctions,
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
            // const shouldDisplayPopup = false
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
          headerActions: ({ children }) => {
            return <div className='dsdsdsdsdsd'>{children}</div>
          },
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

          onPublish?.(data);
        }}
        onAction={async (action, newState, prevState) => {
          const getPuck = getPuckFnRef.current != null ? getPuckFnRef.current : undefined
          if (isDebug) {
            console.log('onAction', action.type, { action, newState, prevState })
          }

          if ((action.type === 'setData' || action.type === 'replace') && getPuck) {
            await delayFn(500)
            updateOutline(getPuck)
          }
        }}
      />
    </>
  )
}
