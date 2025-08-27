import type { Config, FieldProps } from "@measured/puck"
import type { FC, PropsWithChildren, ReactNode } from "react"
import type { Field, Participant } from '@azavista/advanced-search'
import type {Event} from '../../shared/types'
import type { FieldTypeContainerAdditionalProps } from "./PuckEditor.ui.util"

export type PuckConfigComponents<
  MainComponentMap extends {
    [componentName: string]: AzavistaPuckMainComponent<any, number>
  },
  ChildComponentMap extends {
    [componentName: string]: AzavistaPuckComponent<any>
  },
> = {
  [componentName in keyof MainComponentMap]: MainComponentMap[componentName]['componentData']['defaultProps']
} & {
  [componentName in keyof ChildComponentMap]: ChildComponentMap[componentName]['componentData']['defaultProps']
}

export type Category<ComponentName extends string> = {
  components?: ComponentName[]
  title?: string
  visible?: boolean
  defaultExpanded?: boolean
}

export type PuckEditorProps<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
  Metadata extends PuckEditorMetadata<{}>
> = {
  mainComponentMap: MainComponentMap
  childComponentMap: ChildComponentMap
  categories: Record<CategoryName, Category<Extract<keyof MainComponentMap, string>>>
  contentData: any
  styleUrls: string[]
  metadata: Metadata
}

export type PuckEditorLanguage = {
    id: string;
    label: string;
  }

export type PuckEditorDictionaryItem = {
  [translationKey: string]: string
}

  export type PuckEditorDictionary = {
    [languageCode: string]: PuckEditorDictionaryItem
  }

export type PuckEditorMetadata<Props extends {} = {}> = {
  selectedLanguage: string;
  languages: Array<PuckEditorLanguage>
  dictionary: PuckEditorDictionary;
  participant: Participant
  participantFields: Field[]
  event: Event
  eventFields: Field[]
} & Props;

export type AzavistaPuckComponent<
  Props extends {},
  DataConfig extends Config<{
    components: { [fieldName: string]: Props }
  }> = Config<{
    components: { [fieldName: string]: Props }
  }>,
> = {
  componentData: DataConfig['components'][keyof DataConfig['components']] & { defaultProps: Props }
  overridePropField?: Partial<{
    [fieldName in keyof Props]: FC<
      FieldProps & PropsWithChildren<FieldTypeContainerAdditionalProps>
    >
  }>
  overrideFieldsWrapper?: {
    additionalClassName?: string
    shouldDisplayPopup?: boolean
  }
}

/** 
 * @LatestVersion integer
 * 
*/
export type AzavistaPuckMainComponent<
Props extends {},
LatestVersion extends number> = AzavistaPuckComponent<
  Props & {
    name?: string
    version: LatestVersion | (number & {})
  }
>
