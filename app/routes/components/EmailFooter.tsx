import type { Slot } from '@measured/puck'
import { EmailSectionContainer } from 'lib/components/Commons/EmailSectionContainer'
import { getConfigFieldVersion, getConfigFieldCss } from 'lib/components/PuckEditor/PuckEditor.ui.util'
import type { AzavistaPuckMainComponent } from 'lib/components/PuckEditor/type'
import type { CssSelection } from 'lib/shared/types'

export const EmailFooterPuckComponent: AzavistaPuckMainComponent<{
  content: Slot
  css: CssSelection
}, 2> = {
  componentData: {
    fields: {
      name: { type: 'text' },
      version: getConfigFieldVersion(2),
      css: getConfigFieldCss(),
      content: {
        type: 'slot',
        allow: ['RendererTextArea'],
      },
    },
    defaultProps: {
      version: 2,
      content: [
        {
          type: 'RendererTextArea',
          props: {
            content: 'Street | City | Country | Phone | Email',
          },
        },
      ],
      css: [],
    },
    render: ({ content: Content }) => (
      <EmailSectionContainer
        config={{
          section: {
            name: 'section-footer-default',
            classnames: [`section-footer-default`, `aza-footer`],
          },
        }}>
        <div data-gjs-type='default' className='aza-cell' draggable='true'>
          <div data-gjs-type='text' data-azavista-translatable='' className='aza-footer-text-main aza-text'>
            <Content />
          </div>
        </div>
      </EmailSectionContainer>
    ),
  },
}
