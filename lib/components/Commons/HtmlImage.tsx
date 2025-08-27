import type { WithId, WithPuckProps } from '@measured/puck'
import type { FC } from 'react'
import { FieldTypeContainer } from '../PuckEditor/PuckEditor.ui.util'
import type { AzavistaPuckComponent } from '../PuckEditor/type'
import { createUrl } from 'lib/shared/utils'

import './HtmlImage.scss'
import { selectParentComponent, useGetPuckAnyWhere } from '../PuckEditor/PuckEditor.util'

export type HtmlImageProps = { src: string; name?: string }

export const COMPONENT_DATA_HTML_IMAGE_DEFAULT = {
  src: 'https://3.0.devk8s.azavista.com/assets/img/logo-placeholder.png',
} satisfies HtmlImageProps

export const HtmlImageRenderer: FC<WithId<WithPuckProps<HtmlImageProps>>> = (params) => {
  const { src } = { ...COMPONENT_DATA_HTML_IMAGE_DEFAULT, ...params }
  return <img src={src} />
}

export const HtmlImagePuckComponent: AzavistaPuckComponent<HtmlImageProps> = {
  componentData: {
    label: 'Image',
    fields: {
      src: { type: 'text' },
    },
    render: (params) => {
      const { src } = { ...COMPONENT_DATA_HTML_IMAGE_DEFAULT, ...params }
      return <img src={src} />
    },
    defaultProps: COMPONENT_DATA_HTML_IMAGE_DEFAULT,
  },
  overridePropField: {
    src: (props) => {
      const { metadata, onChange, id, value } = props
      const { assets, assetsDefaultBaseUrl } = metadata
      const getPuck = useGetPuckAnyWhere()
      return (
        <FieldTypeContainer {...props}>
          <div className='image-file-selection__list row gap-3 container-md'>
            {assets.map((asset) => {
              const url = createUrl(asset.file_url, assetsDefaultBaseUrl)
              if (asset.content_type.startsWith('image/')) {
                const selectItem = () => {
                  onChange(url)
                  const componentId = id?.split('_')[0]
                  if (componentId && getPuck) {
                    selectParentComponent(componentId, getPuck)
                  }
                }
                return (
                  <a
                    key={asset.id}
                    onClick={selectItem}
                    className={`image-file-selection__list__item col d-flex flex-column ${url === value ? 'bg-secondary' : 'bg-light'}`}>
                    <div className='image-file-selection__list__item__box row flex-grow-1 align-items-center justify-content-center'>
                      <img className='image-file-selection__list__item__image img-fluid' src={url} loading='lazy' />
                    </div>
                    <div className='image-file-selection__list__item__name row text-wrap'>{url}</div>
                  </a>
                )
              }
            })}
          </div>
        </FieldTypeContainer>
      )
    },
  },
  overrideFieldsWrapper: {
    shouldDisplayPopup: true,
  },
}
