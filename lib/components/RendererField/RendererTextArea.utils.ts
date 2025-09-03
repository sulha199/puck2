import type { Participant } from "@azavista/advanced-search"
import type { PuckEditorDictionaryItem } from "../PuckEditor/type"

export function getReplacedContentWithMergeTags(selectedContent: string, params: {
  participant: boolean;
  dictionary: boolean;
}, lang: string, participant: Participant, dictionary: PuckEditorDictionaryItem) {
  const paramsAny = params as Record<string, boolean>;
  const mergeTags = [...selectedContent.matchAll(/\{\{[^\}]+\}\}/gm)]
  let replacedContent = `${selectedContent}`
  mergeTags.forEach((regexResult) => {
    const tag = regexResult[0]
    const [entity, field] = tag
      // .replaceAll(/(\[{2}|\]{2})/gm, '')
      .replaceAll(/(\{{2}|\}{2})/gm, '')
      .trim()
      .split('.')

    if (paramsAny[entity] != null) {
      let replacement = `{{${entity}.${field} is unknown}}`
      switch (entity) {
        case 'participant': {
          const fieldValue = (participant as any)[field]
          replacement = fieldValue ?? replacement
        }
        case 'dictionary': {
          const fieldValue = (dictionary[lang] as any)[field]
          replacement = fieldValue ?? replacement
        }
      }
      replacedContent = replacedContent.replaceAll(tag, replacement)
    }
  })
  return replacedContent
}
