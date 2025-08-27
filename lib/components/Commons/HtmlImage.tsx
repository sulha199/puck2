import type { WithId, WithPuckProps } from '@measured/puck'
import type { FC } from 'react'
import { FieldTypeContainer } from '../PuckEditor/PuckEditor.ui.util'
import type { AzavistaPuckComponent } from '../PuckEditor/type';

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
      return (
        <FieldTypeContainer {...props}>
          <div>
            Here should show Image picker <br />
            and image thumb nails
          </div>
        </FieldTypeContainer>
      )
    },
  },    
  overrideFieldsWrapper: {
    shouldDisplayPopup: true,
  }
}
