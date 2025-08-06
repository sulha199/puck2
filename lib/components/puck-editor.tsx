import { createUsePuck, Puck, useGetPuck } from '@measured/puck'
import { config } from 'puck.config'
// import { useLoaderData, useFetcher } from 'react-router'
// // import type { loader } from '~/routes/_index'
// import type { action } from '~/routes/puck-splat'
import editorStyles from '@measured/puck/puck.css?url'
import { PuckCkEditor } from './EditorRichText/CkEditor/CkEditor'
import { useEffect, useRef, useState } from 'react'
import { loadStorage, saveStorage } from '~/routes/_index'
import './puck-editor.scss'

const styleUrls = [
  'https://3.0.devk8s.azavista.com/azavista-builder-newsletter-default.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://3.0.devk8s.azavista.com/theme/63e50adf44e7429377b6b4ba.css',
]

export function PuckEditor() {
  // const loaderData = useLoaderData<typeof loader>()
  const data = loadStorage()
  const [ isReadOnly, setIsReadOnly ] = useState(false)
  const iframeRef = useRef<Document>(null)

  return (
    <>
      <link rel='stylesheet' href={editorStyles} id='puck-css' />
      <Puck
        config={config}
        data={data}
        ui={{
          previewMode: isReadOnly ? 'interactive' : 'edit',
        }}
        overrides={{
          fieldTypes: {
            textarea: props => <PuckCkEditor {...props} />,
          },

          fields: ({ children }) => {
            const usePuck = createUsePuck()

            const puckStore = usePuck((s) => s)
            const selectedItem = puckStore?.selectedItem
            const type = selectedItem?.type || 'Nothing';

            const className = `puck-fields__${type}`

            const selectParentSection = () => {
              console.log(puckStore)
              const parentElement = iframeRef
              .current?.querySelector(`*[data-puck-component]:has(*[data-puck-component=${selectedItem?.props.id}])`);
              parentElement?.children?.[0]?.dispatchEvent(new MouseEvent("click", {
                  "view": window,
                  "bubbles": true,
                  "cancelable": false
              }))
            }

            return <div className={className}>              
              <div className={`${className}__container`}>{children}</div>
              {type === 'RendererTextArea' && <button onClick={selectParentSection} className={`${className}__close`}>X</button>}
              
            </div>
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
                iframeRef.current = document;
              }
            }, [document])
            return <>{children}</>
          },
          headerActions: ({children}) => {
            return <div className='dsdsdsdsdsd'>{children}</div>
          },
          outline: ({children}) => {
            return <div className="puck-outlines">{children}</div>
          }
          

        }}
        onPublish={async (data) => {
          setIsReadOnly(true);

          console.log('savePage', { data })
          saveStorage(data)
        }}
      />
    </>
  )
}
