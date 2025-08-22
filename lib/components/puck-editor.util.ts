import {
  useGetPuck,
  type ComponentDataMap,
  type ExtractConfigParams,
  type PuckApi,
} from '@measured/puck'
import type { PuckConfig } from 'puck.config'

export type GetPuckFn = () => PuckApi<PuckConfig>

export const useGetPuckAnyWhere = () => {
  try {
    return useGetPuck() as any as GetPuckFn
  } catch (e) {
    return null
  }
}

export const getPuckComponentName = (componentId: string, getPuck: GetPuckFn) => {
  const { config, getItemById } = getPuck()
  const componentProps = getItemById(componentId)
  if (!componentProps) {
    return undefined
  }
  return componentProps.props.name || config.components[componentProps.type]?.label || componentProps.type
}

export const selectParentComponent = (componentId: string, getPuck: GetPuckFn) => {
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

export const getComponentParentId = (componentId: string, getPuck: GetPuckFn): string | undefined => {
  const { getSelectorForId } = getPuck()
  const itemSelector = getSelectorForId(componentId)
  const parentComponentId = itemSelector?.zone.split(':')[0]
  return parentComponentId
}

export const updateComponentData = <
  T extends keyof PuckConfig['components'],
  DataProps extends ExtractConfigParams<PuckConfig>['props'][T],
>(
  componentId: string,
  type: T,
  dataProps: DataProps | ((prev: DataProps) => DataProps),
  getPuck: GetPuckFn
): boolean => {
  const { getSelectorForId, dispatch } = getPuck()

  const { index, zone } = getSelectorForId(componentId) || {}
  let component = getComponent(componentId, type, getPuck)
  if (index != undefined && zone != undefined && component) {
    component = {
      ...component,
      props: {...component.props}
    }
    const dataPropsToDispatch = typeof dataProps === 'function' ? dataProps(component.props as DataProps) : dataProps
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

export const getComponent = <T extends keyof PuckConfig['components']>(
  componentId: string,
  type: T,
  getPuck: GetPuckFn
): ComponentDataMap<Pick<ExtractConfigParams<PuckConfig>['props'], T>> | undefined => {
  const { getItemById } = getPuck()
  const component = getItemById(componentId) as any | undefined
  return component
}
