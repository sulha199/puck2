import { PuckEditor } from 'lib/components/PuckEditor/PuckEditor'
import type { Route } from './+types/puck-splat'
// import { resolvePuckPath } from "~/lib/resolve-puck-path.server";
// import { getPage, savePage } from "~/lib/pages.server";
// import { Page } from 'lib/components/page'
import { HtmlImagePuckComponent } from 'lib/components/Commons/HtmlImage'
import { RendererTextAreaPuckComponent } from 'lib/components/RendererField/RendererTextArea'
import { EmailHeaderPuckComponent } from './components/EmailHeader'
import { EmailSectionTwoColumnsPuckComponent } from './components/EmailSectionTwoColumns'
import { EmailFooterPuckComponent } from './components/EmailFooter'
import type { Data } from '@measured/puck'

// export async function loader({ params }: Route.LoaderArgs) {
//   const pathname = params["*"] ?? "/";
//   const { isEditorRoute, path } = resolvePuckPath(pathname);
//   let page = await getPage(path);

//   // Throw a 404 if we're not rendering the editor and data for the page does not exist
//   if (!isEditorRoute && !page) {
//     throw new Response("Not Found", { status: 404 });
//   }

//   // Empty shell for new pages
//   if (isEditorRoute && !page) {
//     page = {
//       content: [],
//       root: {
//         props: {
//           title: "",
//         },
//       },
//     };
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
//       title: loaderData?.isEditorRoute
//         ? `Edit: ${loaderData.path}`
//         : loaderData?.data.root.title,
//     },
//   ];
// }

// export async function action({ params, request }: Route.ActionArgs) {
//   const pathname = params["*"] ?? "/";
//   const { path } = resolvePuckPath(pathname);
//   const body = (await request.json()) as { data: Data };

//   await savePage(path, body.data);
// }



const styleUrls = [
  'https://3.0.devk8s.azavista.com/azavista-builder-newsletter-default.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://3.0.devk8s.azavista.com/theme/63e50adf44e7429377b6b4ba.css',
]

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

export default function PuckSplatRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <PuckEditor
        isDebug={true}
        childComponentMap={{
          HtmlImage: HtmlImagePuckComponent,
          RendererTextArea: RendererTextAreaPuckComponent,
        }}
        mainComponentMap={{
          EmailHeader: EmailHeaderPuckComponent,
          EmailTwoColumnText: EmailSectionTwoColumnsPuckComponent,
          EmailFooter: EmailFooterPuckComponent,
        }}
        styleUrls={styleUrls}
        contentData={loadStorage()}
        categories={{
          section: {
            title: 'Sections',
            components: ['EmailFooter', 'EmailHeader', 'EmailTwoColumnText'],
          }
        }}
        onPublish={data => saveStorage(data)}
        ></PuckEditor>
    </div>
  )
}
