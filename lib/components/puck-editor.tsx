import { createUsePuck, Puck, useGetPuck } from '@measured/puck'
import { config } from 'puck.config'
// import { useLoaderData, useFetcher } from 'react-router'
// // import type { loader } from '~/routes/_index'
// import type { action } from '~/routes/puck-splat'
import editorStyles from '@measured/puck/puck.css?url'
import { PuckCkEditor } from './EditorRichText/CkEditor'
import { useEffect, useState } from 'react'
import { loadStorage, saveStorage } from '~/routes/_index'

const styleUrls = [
  'https://3.0.devk8s.azavista.com/azavista-builder-newsletter-default.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://3.0.devk8s.azavista.com/theme/63e50adf44e7429377b6b4ba.css',
]

export function PuckEditor() {
  // const loaderData = useLoaderData<typeof loader>()
  const data = loadStorage()
  const [ isReadOnly, setIsReadOnly ] = useState(false)

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

            const type = usePuck((s) => s.selectedItem?.type || 'Nothing')

            return <div className={`${type} sfddfdfff`}>{children}</div>
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
              }
            }, [document])
            return <>{children}</>
          },
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
