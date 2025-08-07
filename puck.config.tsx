import { FieldLabel, type ArrayField, type ComponentConfig, type Config, type CustomField, type Field, type Slot } from '@measured/puck'
import { EmailSectionContainer, EmailSectionTwoColumn } from 'lib/components/Commons/EmailSectionContainer'
import { RendererTextAreaAttr, type RendererTextAreaAttrProps } from 'lib/components/RendererField/RendererTextArea'
import type { FC } from 'react'

type CssSelection = Array<string>

type Props = {
  EmailHeader: { version: number; children: Slot, css: CssSelection }
  EmailFooter: { version: number; content: Slot, css: CssSelection }
  EmailTwoColumnText: { version: number; col1: Slot; col2: Slot, type: 'type-1' | 'type-2', css: CssSelection }
  HtmlImage: { src: string;}
  RendererTextArea: RendererTextAreaAttrProps
  // HtmlSection: { children: Slot; version: number }
}

type ComponentName = keyof Props

const COMPONENTS_LATEST_VERSION_MAP = {
  EmailHeader: 2,
  EmailFooter: 2,
  HtmlImage: 2,
  EmailTwoColumnText: 2,
  RendererTextArea: 2,
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
    css: [],
  },
  EmailFooter: {
        version: COMPONENTS_LATEST_VERSION_MAP.EmailFooter,
        content: [
          {
            type: 'RendererTextArea',
            props: {
              content: 'Street | City | Country | Phone | Email'
            },
          }
        ],
        css: [],
  },
  HtmlImage: {
        src: 'https://3.0.devk8s.azavista.com/assets/img/logo-placeholder.png',
      },
  EmailTwoColumnText: {
        version: COMPONENTS_LATEST_VERSION_MAP.EmailTwoColumnText,
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
        type: 'type-2',
        css: [],
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
    placeholder: `Use latest`,
  } as const satisfies Field<number>
}

const getConfigFieldCss = <T extends ComponentName>(componentName: T) => {
  const styleNames = [
    'style1', 'style2', 'style3'
  ]  
  const label = 'CSS'
  return {    
    label,
    type: "custom",
    render: ({ name, onChange, value, field, id}) => {
      const getCheckboxId = (value: string) => `${componentName}__${id}__css__option--${value}`;
      const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const options = event.target.options;
        const values = [];
        for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
            values.push(options[i].value);
          }
        }
        onChange(values);
      };
      const onCheckChange = (e: React.ChangeEvent<HTMLInputElement>, styleName: string) => {
        const styleNameIndex = value?.indexOf(styleName);
        const isStyleNameExist = styleNameIndex >= 0;
        if (e.target.checked) {
          if (!isStyleNameExist) {
            onChange(value.concat([styleName]));
          }
        } else {
          if (isStyleNameExist) {
            onChange(value.filter(v => v != styleName));
          }
        }
      }
      return <>
        <FieldLabel label={label}/>
        <div className="bg-light">
          {styleNames.map(name => {
            const id = getCheckboxId(name);
            return <div className="form-check" key={id}>
              <input className="form-check-input" type="checkbox" value={name} id={id} checked={value?.includes(name)} onChange={e => onCheckChange(e, name)}/>
              <label className="form-check-label" htmlFor={id}>
                {name}
              </label>
            </div>
          })}      
        </div>  
      </>
    },
  } as const satisfies Field<string[]>
}

const HtmlImage: FC<Props['HtmlImage']> = ({ src }) => {
  return <img src={src} />
}

const PuckConfigEmailHeader = {
  fields: {
    version: getConfigFieldVersion('EmailHeader'),
    css: getConfigFieldCss('EmailHeader'),
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
        version: getConfigFieldVersion('EmailFooter'),
        css: getConfigFieldCss('EmailFooter'),
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
        version: getConfigFieldVersion('EmailTwoColumnText'),
        css: getConfigFieldCss('EmailTwoColumnText'),
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
              value: 'type-1'
            },
            {
              label: 'Type 2',
              value: 'type-2'
            }
          ]
        }
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
        useTranslation: {
          label: 'Translate',
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
        content: {
          type: 'textarea',
          label: 'Universal Content',
        },
        contentTranslations: {
          type: 'object',
          label: 'Language Translations',
          objectFields: {         
            en_us: { type: "textarea", label: 'en_us'},
            id_id: { type: "textarea", label: 'id_id' },   
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
      visible: false,
    },
  },
}
