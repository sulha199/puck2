import { Puck } from "@measured/puck";
import { config } from "puck.config";
import { useLoaderData, useFetcher } from "react-router";
import type { loader } from "~/routes/_index";
import type { action } from "~/routes/puck-splat";
import editorStyles from "@measured/puck/puck.css?url";

export function PuckEditor() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <>
      <link rel="stylesheet" href={editorStyles} id="puck-css" />
      <Puck
        config={config}
        data={loaderData.data}
        onPublish={async (data) => {
          await fetcher.submit(
            {
              data,
            },
            {
              action: "",
              method: "post",
              encType: "application/json",
            }
          );
        }}
      />
    </>
  );
}