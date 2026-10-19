import { createRequestHandler } from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  (import.meta as ImportMeta & { env?: { MODE?: string } }).env?.MODE ??
    "production"
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isProductionHost = url.hostname === "premierresorttravels.com" || url.hostname === "www.premierresorttravels.com";
    if (isProductionHost && (url.protocol !== "https:" || url.hostname !== "premierresorttravels.com")) {
      url.protocol = "https:";
      url.hostname = "premierresorttravels.com";
      return Response.redirect(url.toString(), 301);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
