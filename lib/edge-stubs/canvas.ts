/**
 * Edge-runtime stand-in for `@napi-rs/canvas`.
 *
 * `@napi-rs/canvas` is a native Node addon: it cannot be bundled for
 * Cloudflare Workers, and Workers cannot load a `.node` binding at all. The
 * Workers build aliases this package to this file, so the app still bundles
 * and every route that does not rasterise a PDF works normally.
 *
 * The route that needs a real canvas fails with an explanation instead of
 * an opaque module-resolution error.
 */

const MESSAGE =
  "PDF rasterisation is not available on the edge runtime: @napi-rs/canvas is a native Node addon and cannot run on Cloudflare Workers.";

export function createCanvas(): never {
  throw new Error(MESSAGE);
}

export class Canvas {
  width = 0;
  height = 0;
  getContext(): never {
    throw new Error(MESSAGE);
  }
}

export type SKRSContext2D = unknown;
