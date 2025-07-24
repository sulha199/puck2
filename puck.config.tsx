import type { ComponentConfig, Config, Field, Slot } from '@measured/puck'
import { EmailSectionContainer, EmailSectionTwoColumn } from 'lib/components/Commons/EmailSectionContainer'
import { RendererTextAreaAttr, type RendererTextAreaAttrProps } from 'lib/components/RendererField/RendererTextArea'
import type { FC } from 'react'

type Props = {
  EmailHeader: { version: number; children: Slot }
  EmailFooter: { content: Slot }
  EmailTwoColumnText: { col1: Slot; col2: Slot }
  HtmlImage: { src: string;}
  RendererTextArea: RendererTextAreaAttrProps
  // HtmlSection: { children: Slot; version: number }
}

type ComponentName = keyof Props

const COMPONENTS_LATEST_VERSION_MAP = {
  EmailHeader: 2,
  EmailFooter: 1,
  HtmlImage: 1,
  EmailTwoColumnText: 1,
  RendererTextArea: 1,
  // HtmlSection: 1,
} as const satisfies Record<ComponentName, number>


const COMPONENTS_DATA_MAP = {
  EmailHeader: {
    version: COMPONENTS_LATEST_VERSION_MAP.EmailHeader,
    children: [
      {
        type: 'HtmlImage',
        props: {},
      },
    ],
  },
  EmailFooter: {    
        content: [
          {
            type: 'RendererTextArea',
            props: {
              content: 'Street | City | Country | Phone | Email'
            },
          }
        ]
  },
  HtmlImage: {
        src: 'https://3.0.devk8s.azavista.com/assets/img/logo-placeholder.png',
      },
  EmailTwoColumnText: {
        col1: [
          {
            type: 'RendererTextArea',
            props: {
              content: `This is a column in a two column text section. Content related to the event can be added here.`,
            },
          },
        ],
        col2: [
          {
            type: 'RendererTextArea',
            props: {
              content: `This is a column in a two column text section. Content related to the event can be added here.`,
            },
          },
        ],
      },
  RendererTextArea: {
    content: 'Edit text',
    useTranslation: 0,
    contentTranslations: {
      en_us: '',
      id_id: '',
    },
  },
} as const satisfies {[componentName in ComponentName]: Props[componentName]}

// export const config: Config<Props> = {
//   components: {
//     HeadingBlock: {
//       fields: {
//         title: { type: "textarea" },

//       },
//       defaultProps: {
//         title: "Heading",
//       },
//       render: ({ title }) => (
//         <div style={{ padding: 64 }}>
//           <h1 {...RendererTextAreaAttr({ content: title, fieldName: 'title', fieldType: 'textarea'})}></h1>
//         </div>
//       ),
//     },
//   },
// };

const getConfigFieldVersion = <T extends ComponentName>(componentName: T) => {
  return {
    type: 'number',
    min: 1 as const,
    max: COMPONENTS_LATEST_VERSION_MAP[componentName],
  } as const satisfies Field<number>
}

const HtmlImage: FC<Props['HtmlImage']> = ({ src }) => {
  return <img src={src} />
}

const PuckConfigEmailHeader = {
  fields: {
    version: getConfigFieldVersion('EmailHeader'),
    children: { type: 'slot' },
  },
  defaultProps: COMPONENTS_DATA_MAP.EmailHeader,
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
} satisfies Omit<ComponentConfig<Props['EmailHeader'], Props['EmailHeader']>, 'type'>

export const config: Config<Props> = {
  components: {
    EmailHeader: PuckConfigEmailHeader,
    EmailFooter: {
      fields: {
        content: {
          type: 'slot',
          allow: ['RendererTextArea'],
        },
      },
      defaultProps: COMPONENTS_DATA_MAP.EmailFooter,
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
    EmailTwoColumnText: {
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
        col1: {
          type: 'slot',
          allow: ['RendererTextArea'],
        },
        col2: {
          type: 'slot',
          allow: ['RendererTextArea'],
        },
      },
      defaultProps: COMPONENTS_DATA_MAP.EmailTwoColumnText,
    },
    HtmlImage: {
      label: 'Image',
      fields: {
        src: { type: 'text' },
      },
      render: (params) => {
        const { src } = {...COMPONENTS_DATA_MAP.HtmlImage, ...params}
        return <img src={src} />
    },
      defaultProps: COMPONENTS_DATA_MAP.HtmlImage,
    },
    RendererTextArea: {
      label: 'Text Area',
      fields: {
        content: {
          type: 'textarea',
          label: 'Content',
        },
        useTranslation: {
          type: 'select',
          options: [
            {
              value: 0,
              label: 'no'
            },
            {
              value: 1,
              label: 'yes'
            },
          ]
        },
        contentTranslations: {
          type: 'object',
          objectFields: {
            id_id: { type: "textarea", label: 'id_id' },            
            en_us: { type: "textarea", label: 'en_us'},
          }, 
        }
      },
      defaultProps: COMPONENTS_DATA_MAP.RendererTextArea,
      render: (props) => <div {...RendererTextAreaAttr(props)} />,
    },
  },
  categories: {
    section: {
      title: 'Sections',
      components: ['EmailFooter', 'EmailHeader', 'EmailTwoColumnText'],
    },
    foundational: {
      title: 'Basic Element',
      components: ['HtmlImage', 'RendererTextArea'],
    },
  }
}
