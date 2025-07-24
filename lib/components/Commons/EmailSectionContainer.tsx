import type { FC, PropsWithChildren, ReactNode } from 'react'
import { HtmlComment } from './HtmlComment'

type SlotComponent = () => ReactNode

type ElementProperties = {
  classnames?: string[]
  attributes?: string[]
}

type ColumnConfig = ElementProperties & {
  content: ReactNode
}

type SectionWrapperConfig = {
  section: {
    /** Section name without the `-email` suffix */
    name: string
  } & ElementProperties
  container?: ElementProperties
}

type TwoColumnConfig = SectionWrapperConfig & {
  firstColumn: ColumnConfig
  secondColumn: ColumnConfig
}

export enum GenericTwoColumnType {
  normal = 'section-generic-two-column-ltr',
  reversed = 'section-generic-two-column-rtl',
}
/**
 *
 * @param config
 * @param content content should be string that is wrapped around by `VML`'s `td`  tag
 * @returns
 */
export const EmailSectionContainer: FC<PropsWithChildren<{ config: SectionWrapperConfig }>> = ({
  config,
  children,
}) => {
  const { section, container } = config
  return (
    <table
      aza-block-container
      border={0}
      cellPadding={20}
      cellSpacing={0}
      width='100%'
      align='center'
      aza-alternate
      {...container?.attributes?.reduce(
        (record, attr) => ({
          ...record,
          [attr]: true,
          [`attr.${attr}`]: true,
        }),
        {}
      )}
      className={`${section.name}-email ${container?.classnames?.join(' ') ?? ''}`}>
      <HtmlComment>{` ${section.name} start `}</HtmlComment>
      <tbody>
        <tr>
          <td align='center' className={`${section.name} ${section.classnames?.join(' ') ?? ''} aza-section aza-theme`}>
            <table border={0} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td align='center' className='aza-section-content aza-section-colors'>
                    <HtmlComment>{`[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" data-gjs-copyable="false">
            <tbody data-gjs-copyable="false">
            <tr data-gjs-copyable="false">
              <td
                align="center"
                valign="top"
                width="600" data-gjs-copyable="false"
              >
            <![endif]`}</HtmlComment>
                    <HtmlComment>{`[if (gte mso 9)|(IE)]>
                 <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" data-gjs-copyable="false">
                 <tbody data-gjs-copyable="false">
                 <tr data-gjs-copyable="false">
             <![endif]`}</HtmlComment>
                    {children}
                    <HtmlComment>{`[if (gte mso 9)|(IE)]>
           </tr>
           </tbody>
           </table>
           <![endif]`}</HtmlComment>
                    <HtmlComment>{`[if (gte mso 9)|(IE)]>
           </td>
           </tr>
           </tbody>
           </table>
           <![endif]`}</HtmlComment>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <HtmlComment>{` ${section.name} end `}</HtmlComment>
    </table>
  )
}

export const EmailSectionTwoColumn: FC<{ config: TwoColumnConfig }> = ({ config }) => {
  const { firstColumn, secondColumn, container } = config
  const updatedConfig: TwoColumnConfig = {
    ...config,
    container: {
      ...container,
      classnames: [...(container?.classnames ?? []), 'section-generic-two-column'],
    },
  }
  return (
    <EmailSectionContainer config={updatedConfig}>
      <HtmlComment>{`[if (gte mso 9)|(IE)]>
    <td align="left" valign="top" width="310" style="direction: ltr;" data-gjs-copyable="false">
    <![endif]`}</HtmlComment>
      <div className={`aza-cell ${firstColumn.classnames?.join(' ') ?? ''}`}>{firstColumn.content}</div>
      <HtmlComment>{`[if (gte mso 9)|(IE)]>
      </td>
    <![endif]`}</HtmlComment>
      <HtmlComment>{`[if (gte mso 9)|(IE)]>
      <td align="left" valign="top" width="290" style="direction: ltr;">
    <![endif]`}</HtmlComment>
      <div className={`aza-cell aza-cell-last ${secondColumn.classnames?.join(' ') ?? ''}`}>{secondColumn.content}</div>
      <HtmlComment>{`[if (gte mso 9)|(IE)]>
      </td>
    <![endif]`}</HtmlComment>
    </EmailSectionContainer>
  )
}

export const getGenericHeadlineAndText: FC<{
  header: SlotComponent
  headline: SlotComponent
  paragraph: SlotComponent
}> = ({ header, headline, paragraph }) => {
  return (
    <>
      <div data-azavista-translatable className='aza-position aza-text aza-text-header'>
        {header()}
      </div>
      <div data-azavista-translatable className='aza-position aza-text aza-text-headline'>
        {headline()}
      </div>
      <div data-azavista-translatable className='aza-position aza-text'>
        {paragraph()}
      </div>
    </>
  )
}

type GenericButton = {
  text?: string
}
export enum GenericButtonType {
  v1 = 'section-generic-button-v1',
  v2 = 'section-generic-button-v2',
}
export const getGenericButton: FC<{ config?: GenericButton }> = ({ config }) => {
  const { text } = config ?? {}
  return (
    <table className='aza-email-table-button' border={0} cellPadding={0} cellSpacing={0}>
      <tbody data-gjs-editable='false'>
        <tr data-gjs-copyable='false' data-gjs-editable='false'>
          <td align='center' className='aza-section-content aza-section-colors' data-gjs-editable='false'>
            <HtmlComment>{`[if (gte mso 9)|(IE)]>
    <table align="center" border="0" cellspacing="0" cellpadding="0" data-gjs-copyable="false">
    <tbody data-gjs-copyable="false">
    <tr data-gjs-copyable="false">
        <td
        align="center"
        valign="top"
        data-gjs-copyable="false"
        >
    <![endif]`}</HtmlComment>
            <table border={0} cellSpacing={0} cellPadding={0} data-gjs-copyable='false' data-gjs-editable='false'>
              <tbody data-gjs-editable='false'>
                <tr data-gjs-copyable='false' data-gjs-editable='false'>
                  <td
                    align='center'
                    className='aza-button aza-section-inverted-colors'
                    data-gjs-copyable='false'
                    data-gjs-editable='false'>
                    <span data-azavista-translatable data-gjs-copyable='false'>
                      <a>{text ?? 'Request a quote!'}</a>
                      <span className='section-generic-button-v2-arrow'> →</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <HtmlComment>{`[if (gte mso 9)|(IE)]>
    </td>
    </tr>
    </tbody>
    </table>
    <![endif]`}</HtmlComment>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export const getGenericImage: FC = () => {
  return (
    <div className='aza-image-wrapper'>
      <a aza-image-link className='aza-image-link'>
        <img width='290' src='https://3.0.devk8s.azavista.com/assets/img/image-placeholder.jpg' data-gjs-copyable='false' />
      </a>
    </div>
  )
}
