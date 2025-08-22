import type { Data } from "@measured/puck";
import { Render } from "@measured/puck";

import { PUCK_CONFIG } from "../../puck.config";

export function PuckRender({ data }: { data: Data }) {
  return <Render config={PUCK_CONFIG} data={data} />;
}
