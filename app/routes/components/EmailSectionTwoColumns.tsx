import type { Slot } from '@measured/puck'
import { EmailSectionTwoColumn } from 'lib/components/Commons/EmailSectionContainer'
import { getConfigFieldVersion, getConfigFieldCss } from 'lib/components/PuckEditor/PuckEditor.ui.util'
import type { AzavistaPuckMainComponent } from 'lib/components/PuckEditor/type'
import type { RendererTextAreaAttrProps } from 'lib/components/RendererField/RendererTextArea'
import type { CssSelection } from 'lib/shared/types'

export const EmailSectionTwoColumnsPuckComponent: AzavistaPuckMainComponent<
  {
    col1: Slot
    col2: Slot
    type: 'type-1' | 'type-2'
    css: CssSelection
  },
  2,
  { type: 'RendererTextArea'; props: RendererTextAreaAttrProps }
> = {
  componentData: {
    label: 'Section Two-Columns text',
    render: (params) => {
      const { col1: Col1, col2: Col2 } = params
      return (
        <EmailSectionTwoColumn
          config={{
            firstColumn: {
              content: <Col1 />,
            },
            secondColumn: {
              content: <Col2 />,
            },
            section: {
              name: 'section-text-two-column',
              classnames: [`section-text-two-column`],
            },
          }}
        />
      )
    },
    fields: {
      name: { type: 'text' },
      version: getConfigFieldVersion(2),
      css: getConfigFieldCss(),
      col1: {
        type: 'slot',
        allow: ['RendererTextArea'],
      },
      col2: {
        type: 'slot',
        allow: ['RendererTextArea'],
      },
      type: {
        type: 'select',
        label: 'Type',
        options: [
          {
            label: 'Type 1',
            value: 'type-1',
          },
          {
            label: 'Type 2',
            value: 'type-2',
          },
        ],
      },
    },
    defaultProps: {
      version: 2,
      col1: [
        {
          type: 'RendererTextArea',
          props: {
            content: `This is a column in a two column text section. Content related to the event can be added here.`,
            contentTranslations: {},
            useTranslation: 0,
          },
        },
      ],
      col2: [
        {
          type: 'RendererTextArea',
          props: {
            content: `This is a column in a two column text section. Content related to the event can be added here.`,
            contentTranslations: {},
            useTranslation: 0,
          },
        },
      ],
      type: 'type-2',
      css: [],
    },
  },
}
