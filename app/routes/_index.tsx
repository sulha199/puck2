// import type { Route } from "./+types/_index";
// // import { resolvePuckPath } from "~/lib/resolve-puck-path.server";
// // import { getPage } from "~/lib/pages.server";
// import type { Data } from "@measured/puck";

import type { Data } from "@measured/puck";

// // export async function clientLoader() {
// //   const { isEditorRoute, path } = resolvePuckPath("/");
// //   let page = await getPage(path);

// //   if (!page) {
// //     throw new Response("Not Found", { status: 404 });
// //   }

// //   return {
// //     isEditorRoute,
// //     path,
// //     data: page,
// //   };
// // }

// // export function meta({ data: loaderData }: Route.MetaArgs) {
// //   return [
// //     {
// //       title: loaderData?.data.root.title,
// //     },
// //   ];
// // }

// export default function PuckSplatRoute({ loaderData }: Route.ComponentProps) {
//   const data: Data = loadStorage();
//   return <PuckRender data={data} />;
// }


