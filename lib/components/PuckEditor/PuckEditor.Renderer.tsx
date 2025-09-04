import { useMemo } from "react"
import { getUIEditorPuckConfig } from "./PuckEditor.util"
import type { AzavistaPuckMainComponent, AzavistaPuckComponent, PuckEditorProps, PuckEditorMetadata, ChildProps } from "./type"
import { Render } from "@measured/puck"

export function PuckEditorRenderer<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number, ChildProps<ChildComponentMap>> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,  
  Metadata extends PuckEditorMetadata<{}>
>(props: PuckEditorProps<MainComponentMap, ChildComponentMap, CategoryName, Metadata>) {
  const { childComponentMap, contentData, mainComponentMap, categories } = props

  const puckConfig = useMemo(() => getUIEditorPuckConfig(props), [mainComponentMap, childComponentMap, categories])

  return <Render config={puckConfig as any} data={contentData} />;
}