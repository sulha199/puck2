import { dictionary, participant } from "lib/shared/data";

export type Language = keyof typeof dictionary;

export type RendererTextAreaAttrProps = {
  content: string
  useTranslation: 0 | 1
  contentTranslations: {
    [lang in  Language]: string
  }
  fieldType?: string
  fieldName?: string
}

export const RendererTextAreaAttr = (props: RendererTextAreaAttrProps) => {
  const params = new URL(document.location.toString()).searchParams
  const lang: Language = params.get('lang') as Language || 'en_us'
  const { content, fieldName, fieldType, useTranslation, contentTranslations } = props
  const selectedContent = (useTranslation && contentTranslations[lang]) || content
  // const mergeTags = [...selectedContent.matchAll(/\[\[[^\[]*\]\]/gm)]
  const mergeTags = [...selectedContent.matchAll(/\{\{[^\}]+\}\}/gm)]
  let replacedContent = selectedContent
  mergeTags.forEach((regexResult) => {
    const tag = regexResult[0]
    const [entity, field] = tag
      // .replaceAll(/(\[{2}|\]{2})/gm, '')
      
      .replaceAll(/(\{{2}|\}{2})/gm, '')
      .trim()
      .split('.')

    if (params.get(entity) != null) {
      let replacement = `{{${entity}.${field} is unknown}}`
      switch (entity) {
        case 'participant': {
          const fieldValue = (participant as any)[field]
          replacement = fieldValue ?? replacement;
        }
        case 'dictionary': {
          const fieldValue = (dictionary[lang] as any)[field]
          replacement = fieldValue ?? replacement;
        }
      }
      replacedContent = replacedContent.replaceAll(tag, replacement)
    }
  })
  return {
    ['attr.field-type']: fieldType,
    ['attr.field-name']: fieldName,
    dangerouslySetInnerHTML: { __html: replacedContent },
  }
}
