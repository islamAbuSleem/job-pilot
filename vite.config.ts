import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  resolve: {
    alias: {
      // Native Node addons cannot be bundled for - or run on - the edge.
      // These aliases keep the build green; the routes that need them fail
      // with an explanation at runtime.
      "@napi-rs/canvas": resolve(here, "lib/edge-stubs/canvas.ts"),
      "@browserbasehq/stagehand": resolve(here, "lib/edge-stubs/stagehand.ts"),
    },
  },
});
