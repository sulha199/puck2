import type { Route } from "./+types/_index";
import { PuckRender } from "lib/components/puck-render";
// import { resolvePuckPath } from "~/lib/resolve-puck-path.server";
// import { getPage } from "~/lib/pages.server";
import type { Data } from "@measured/puck";

// export async function clientLoader() {
//   const { isEditorRoute, path } = resolvePuckPath("/");
//   let page = await getPage(path);

//   if (!page) {
//     throw new Response("Not Found", { status: 404 });
//   }

//   return {
//     isEditorRoute,
//     path,
//     data: page,
//   };
// }

// export function meta({ data: loaderData }: Route.MetaArgs) {
//   return [
//     {
//       title: loaderData?.data.root.title,
//     },
//   ];
// }

export default function PuckSplatRoute({ loaderData }: Route.ComponentProps) {
  const data: Data = loadStorage();
  return <PuckRender data={data} />;
}
export function loadStorage() {
  const storageItem = localStorage.getItem('puck-data');
  const data: Data = storageItem ? JSON.parse(storageItem) : {
    content: [],
  };
  return data;
}
export function saveStorage(data: Data) {
  localStorage.setItem('puck-data', JSON.stringify(data));
}

