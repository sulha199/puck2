import type { Slot } from '@measured/puck'
import { EmailSectionContainer } from 'lib/components/Commons/EmailSectionContainer'
import { getConfigFieldVersion, getConfigFieldCss } from 'lib/components/PuckEditor/PuckEditor.ui.util'
import type { AzavistaPuckMainComponent } from 'lib/components/PuckEditor/type'
import type {  CssSelection } from 'lib/shared/types'

export const EmailHeaderPuckComponent: AzavistaPuckMainComponent<{
  children: Slot
  css: CssSelection
}, 2> = {
  componentData: {
    fields: {
        name: {type: 'text'},
        version: getConfigFieldVersion(2),
        css: getConfigFieldCss(),
        children: { type: 'slot' },
      },
      render: ({ version, children }) => (
        <>
          {version === 1 && (
            <EmailSectionContainer
              config={{
                section: {
                  name: 'section-header-light-email',
                  classnames: ['section-header-light-email'],
                },
              }}>
              <div data-gjs-type='default' className='aza-cell'>
                <div data-gjs-type='default' className='aza-image-wrapper'>
                  {children()}
                </div>
              </div>
            </EmailSectionContainer>
          )}
          {version === 2 && <div className='container-lg'>{children()}</div>}
        </>
      ),
    defaultProps: {
      version: 2,
      children: [
        {
          type: 'HtmlImage',
          props: {},
        },
      ],
      css: [],
    },
  },
}
