import { useMemo } from "react"
import { getUIEditorPuckConfig } from "./PuckEditor.util"
import type { AzavistaPuckMainComponent, AzavistaPuckComponent, UIEditorProps } from "./type"
import { Render } from "@measured/puck"

export function PuckEditorRenderer<
  MainComponentMap extends { [componentName: string]: AzavistaPuckMainComponent<any, number> },
  ChildComponentMap extends { [componentName: string]: AzavistaPuckComponent<any> },
  CategoryName extends string,
>(props: UIEditorProps<MainComponentMap, ChildComponentMap, CategoryName>) {
  const { childComponentMap, contentData, mainComponentMap, categories } = props

  const puckConfig = useMemo(() => getUIEditorPuckConfig(props), [mainComponentMap, childComponentMap, categories])

  return <Render config={puckConfig as any} data={contentData} />;
}