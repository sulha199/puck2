import type { Config, FieldProps, Slot } from '@measured/puck'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import type { Field, Participant } from '@azavista/advanced-search'
import type { Event } from '../../shared/types'
import type { FieldTypeContainerAdditionalProps } from './PuckEditor.ui.util'

export type ChildProps<
  ChildComponentMap extends {
    [componentName: string]: AzavistaPuckComponent<any>
  },
  ComponentName extends keyof ChildComponentMap & string = keyof ChildComponentMap & string,
> = {
  type: ComponentName
  props: ChildComponentMap[ComponentName]['componentData']['defaultProps']
}

export type PuckConfigComponents<
  MainComponentMap extends {
    [componentName: string]: AzavistaPuckMainComponent<
      any,
      number,
      ChildProps<ChildComponentMap>
    >
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
  MainComponentMap extends {
    [componentName: string]: AzavistaPuckMainComponent<
      any,
      number,
      ChildProps<ChildComponentMap>
    >
  },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
  Metadata extends PuckEditorMetadata<{}>,
> = {
  mainComponentMap: MainComponentMap
  childComponentMap: ChildComponentMap
  categories: Record<CategoryName, Category<Extract<keyof MainComponentMap, string>>>
  contentData: any
  styleUrls: string[]
  metadata: Metadata
}

export type PuckEditorLanguage = {
  id: string
  label: string
}

export type PuckEditorDictionaryItem = {
  [translationKey: string]: string
}

export type PuckEditorDictionary = {
  [languageCode: string]: PuckEditorDictionaryItem
}

export type PuckEditorMetadata<Props extends {} = {}> = {
  selectedLanguage: string
  languages: Array<PuckEditorLanguage>
  dictionary: PuckEditorDictionary
  participant: Participant
  participantFields: Field[]
  event: Event
  eventFields: Field[]
} & Props

export type ReplacePropertyDeep<TypeReplacement extends any, TypeToReplace extends any, T extends {} = {}> = {
  [propertyName in keyof T]: T[propertyName] extends TypeToReplace
    ? TypeReplacement
    : T[propertyName] extends {}
      ? T[propertyName] extends Function
        ? T[propertyName]
        : ReplacePropertyDeep<TypeReplacement, TypeToReplace, T[propertyName]>
      : T[propertyName]
}

export type OverrideProperty<
  T extends {},
  PropertyTypeReplacement,
  PropertyName extends keyof T,
  ChildPropertyName extends keyof T[PropertyName] = never,
> = Omit<T, PropertyName> & {
  [key in PropertyName]: T[PropertyName] extends {}
    ? ChildPropertyName extends keyof T[PropertyName] & T[PropertyName]
      ? OverrideProperty<T[PropertyName], PropertyTypeReplacement, ChildPropertyName>
      : PropertyTypeReplacement
    : PropertyTypeReplacement
}

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
    [fieldName in keyof Props]: FC<FieldProps & PropsWithChildren<FieldTypeContainerAdditionalProps>>
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
  LatestVersion extends number,
  ChildProps extends { type: string; props: {} },
> = ReplacePropertyDeep<
  ChildProps[],
  Slot,
  AzavistaPuckComponent<
    Props & {
      name?: string
      version: LatestVersion | (number & {})
    }
  >
>
