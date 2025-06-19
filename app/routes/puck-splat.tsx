import type { Data } from "@measured/puck";
import { Render } from "@measured/puck";

import type { Route } from "./+types/puck-splat";
import { config } from "../../puck.config";
import { resolvePuckPath } from "~/lib/resolve-puck-path.server";
import { getPage, savePage } from "~/lib/pages.server";
import { PuckEditor } from "lib/components/puck-editor";

export async function loader({ params }: Route.LoaderArgs) {
  const pathname = params["*"] ?? "/";
  const { isEditorRoute, path } = resolvePuckPath(pathname);
  let page = await getPage(path);

  // Throw a 404 if we're not rendering the editor and data for the page does not exist
  if (!isEditorRoute && !page) {
    throw new Response("Not Found", { status: 404 });
  }

  // Empty shell for new pages
  if (isEditorRoute && !page) {
    page = {
      content: [],
      root: {
        props: {
          title: "",
        },
      },
    };
  }

  return {
    isEditorRoute,
    path,
    data: page,
  };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.isEditorRoute
        ? `Edit: ${loaderData.path}`
        : loaderData?.data.root.title,
    },
  ];
}

export async function action({ params, request }: Route.ActionArgs) {
  const pathname = params["*"] ?? "/";
  const { path } = resolvePuckPath(pathname);
  const body = (await request.json()) as { data: Data };

  await savePage(path, body.data);
}


export default function PuckSplatRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {loaderData.isEditorRoute ? (
        <PuckEditor />
      ) : (
        <Render config={config} data={loaderData.data} />
      )}
    </div>
  );
}
