import {
  useGetPuck,
  type ComponentDataMap,
  type Config,
  type ExtractConfigParams,
  type Field,
  type PuckApi,
} from '@measured/puck'
import {
  type AzavistaPuckComponent,
  type AzavistaPuckMainComponent,
  type PuckConfigComponents,
  type PuckEditorLanguage,
  type PuckEditorMetadata,
  type PuckEditorProps,
} from './type'
import { mapRecordProperty } from 'lib/shared/utils'

export type GetPuckFn<PuckConfig extends Config> = () => PuckApi<PuckConfig>

export const useGetPuckAnyWhere = <PuckConfig extends Config>() => {
  try {
    return useGetPuck() as any as GetPuckFn<PuckConfig>
  } catch (e) {
    return null
  }
}

export const getPuckComponentNameFromFieldId = (fieldId: string): string | undefined => {
  return fieldId.split('-')[0]
}

export const getPuckComponentIdFromFieldId = (fieldId: string): string | undefined => {
  return fieldId.split(':')[0]
}

export const getPuckComponentNameToRender = <PuckConfig extends Config = any>(
  componentId: string,
  getPuck: GetPuckFn<PuckConfig>
) => {
  const { config, getItemById } = getPuck()
  const componentProps = getItemById(componentId)
  if (!componentProps) {
    return undefined
  }
  return componentProps.props.name || config.components[componentProps.type]?.label || componentProps.type
}

export const selectParentComponent = (componentId: string, getPuck: GetPuckFn<any>) => {
  const { getSelectorForId, dispatch } = getPuck()

  const parentComponentId = getComponentParentId(componentId, getPuck)

  if (parentComponentId) {
    dispatch({
      type: 'setUi',
      ui: {
        itemSelector: getSelectorForId(parentComponentId),
      },
    })
  }
}

export const getComponentParentId = (componentId: string, getPuck: GetPuckFn<any>): string | undefined => {
  const { getSelectorForId } = getPuck()
  const itemSelector = getSelectorForId(componentId)
  const parentComponentId = itemSelector?.zone.split(':')[0]
  return parentComponentId
}

export const updateComponentData = <
  PuckConfig extends Config,
  ComponentName extends Extract<keyof PuckConfig['components'], string>,
  DataProps extends ExtractConfigParams<PuckConfig>['props'][ComponentName],
>(
  componentId: string,
  type: ComponentName,
  dataProps: DataProps | ((prev: DataProps) => DataProps),
  getPuck: GetPuckFn<PuckConfig>
): boolean => {
  const { getSelectorForId, dispatch } = getPuck()

  const { index, zone } = getSelectorForId(componentId) || {}
  let component = getComponent(componentId, type, getPuck)
  if (index != undefined && zone != undefined && component) {
    component = {
      ...component,
      props: { ...component.props },
    }
    const dataPropsToDispatch =
      typeof dataProps === 'function' ? (dataProps as any)(component.props as DataProps) : dataProps
    dispatch({
      type: 'replace',
      destinationIndex: index,
      destinationZone: zone,
      data: {
        type,
        props: {
          ...dataPropsToDispatch,
          id: componentId,
        },
      },
    })
    return true
  } else {
    return false
  }
}

export const getComponent = <PuckConfig extends Config, T extends keyof PuckConfig['components']>(
  componentId: string,
  type: T,
  getPuck: GetPuckFn<PuckConfig>
): ComponentDataMap<Pick<ExtractConfigParams<PuckConfig>['props'], T>> | undefined => {
  const { getItemById } = getPuck()
  const component = getItemById(componentId) as any | undefined
  return component
}

export function getUIEditorPuckConfig<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
  Metadata extends PuckEditorMetadata<{}>,
>(
  props: Pick<
    PuckEditorProps<MainComponentMap, ChildComponentMap, CategoryName, Metadata>,
    'mainComponentMap' | 'childComponentMap' | 'categories'
  >
): Config<{
  components: PuckConfigComponents<MainComponentMap, ChildComponentMap>
  categories: CategoryName
  root: {}
  fields: {}
}> {
  const { childComponentMap, mainComponentMap, categories } = props
  const components = {
    ...mapRecordProperty(mainComponentMap, 'componentData'),
    ...mapRecordProperty(childComponentMap, 'componentData'),
  }
  return {
    components: components,
    categories,
  } as any
}

export const getLanguageMap = (languages: PuckEditorLanguage[]) => {
  return languages.reduce(
    (record, lang) => ({
      ...record,
      [lang.id]: { type: 'textarea', label: lang.label, contentEditable: true } as Omit<Field<string>, 'render'>,
    }),
    {} as Record<string, Omit<Field<string>, 'render'>>
  )
}

export class PuckEditorStaticData {
  static componentNameMap: {
    [componentId: string]: string
  } = {}
}