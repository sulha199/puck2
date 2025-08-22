import { Render } from "@measured/puck";
import type { FC } from "react";
import { loadStorage } from "~/routes/_index";
import { PuckEditor } from "./puck-editor";
import { PUCK_CONFIG } from "puck.config";

export const Page: FC = () => {
  console.log(location.href);
  return <>
  {!location.href.includes('render') ? (
        <PuckEditor />
      ) : (
        <Render config={PUCK_CONFIG} data={loadStorage()} />
      )}
  </>
}