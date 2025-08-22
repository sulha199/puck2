import { FieldLabel, Puck, useGetPuck, type FieldProps, type FieldRenderFunctions } from '@measured/puck'
import { PUCK_CONFIG } from 'puck.config'
// import { useLoaderData, useFetcher } from 'react-router'
// // import type { loader } from '~/routes/_index'
// import type { action } from '~/routes/puck-splat'
import editorStyles from '@measured/puck/puck.css?url'
import { PuckCkEditor } from './EditorRichText/CkEditor/CkEditor'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { loadStorage, saveStorage } from '~/routes/_index'
import './puck-editor.scss'

const styleUrls = [
  'https://3.0.devk8s.azavista.com/azavista-builder-newsletter-default.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://3.0.devk8s.azavista.com/theme/63e50adf44e7429377b6b4ba.css',
]

function FieldTypeContainer<T extends keyof FieldRenderFunctions, FieldType extends { type: T }>(props: FieldProps<FieldType, any> & PropsWithChildren<{name: string}>) {
  const { children, field, value, name} = props;
  return (
    <div className={`puck-fields__field puck-fields__field--name_${name} puck-fields__field--type_${field.type} puck-fields__field--value_${value}`}>
      {children}
    </div>
  )
}

export function PuckEditor() {
  // const loaderData = useLoaderData<typeof loader>()
  const data = loadStorage()
  const [isReadOnly, setIsReadOnly] = useState(false)
  const iframeRef = useRef<Document>(null)

  return (
    <>
      <link rel='stylesheet' href={editorStyles} id='puck-css' />
      <Puck
        config={PUCK_CONFIG}
        data={data}
        ui={{
          previewMode: isReadOnly ? 'interactive' : 'edit',
        }}
        overrides={{
          fieldTypes: {
            textarea: (props) => (
              <FieldTypeContainer {...props}>
                {props.field.label && <FieldLabel label={props.field.label} />}
                <PuckCkEditor {...props} />{' '}
              </FieldTypeContainer>
            ),
            text: (props) => {
              const { children, id, name } = props
              const isImageInput = name === 'src' && id?.startsWith('HtmlImage-')

              if (isImageInput) {
                return <FieldTypeContainer {...props}>
                  <div>Here should show Image picker <br/>and image thumb nails</div>
                </FieldTypeContainer>
              }
              return <FieldTypeContainer {...props}></FieldTypeContainer>
            },
            array: FieldTypeContainer,
            external: FieldTypeContainer,
            number: FieldTypeContainer,
            object: FieldTypeContainer,
            radio: FieldTypeContainer,
            select: FieldTypeContainer,
            slot: FieldTypeContainer,
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
            const getPuck = useGetPuck()

            const { selectedItem } = getPuck()
            const type = selectedItem?.type || 'Nothing'

            const className = `puck-fields`
            const classNameWithType = `${className}--type_${type}`

            const selectParentSection = () => {
              const parentElement = iframeRef.current?.querySelector(
                `*[data-puck-component]:has(*[data-puck-component=${selectedItem?.props.id}])`
              )
              parentElement?.children?.[0]?.dispatchEvent(
                new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: false,
                })
              )
            }

            const shouldDisplayPopup = type === 'RendererTextArea' || type === 'HtmlImage'
            // const shouldDisplayPopup = false
            const popupClassname = shouldDisplayPopup ? `${className}--popup-element` : ''

            useEffect(() => {
              console.log('puckHistory', getPuck().selectedItem)
            }, [getPuck().selectedItem]);

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

            return <div className='puck-outlines'>{children}</div>
          },
        }}
        onPublish={async (data) => {
          setIsReadOnly(true)

          console.log('savePage', { data })
          saveStorage(data)
        }}
      />
    </>
  )
}
