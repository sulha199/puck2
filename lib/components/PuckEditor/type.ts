import type { Config, FieldProps } from "@measured/puck"
import type { FC, ReactNode } from "react"

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

export type UIEditorProps<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
> = {
  mainComponentMap: MainComponentMap
  childComponentMap: ChildComponentMap
  categories: Record<CategoryName, Category<Extract<keyof MainComponentMap, string>>>
  contentData: any
  styleUrls: string[]
}

export function mapRecordProperty<T extends Record<string, any>, P extends keyof T[keyof T]>(
  record: T,
  propertyName: P
): { [itemKey in keyof T]: T[itemKey][P] } {
  return Object.keys(record).reduce(
    (result, key) => ({
      ...result,
      [key]: (record[key] as any)[propertyName],
    }),
    {}
  ) as any
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
    [fieldName in keyof Props]: FC<
      FieldProps & {
        children: ReactNode
        name: string
      }
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
