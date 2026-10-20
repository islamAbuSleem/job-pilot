/**
 * Edge-runtime stand-in for `@browserbasehq/stagehand`.
 *
 * Stagehand drives a real browser through the Browserbase SDK, which needs
 * a Node runtime. The Workers build aliases this package to this file so the
 * app bundles; the two routes that need a live browser fail with an
 * explanation rather than a module-resolution error.
 */

const MESSAGE =
  "Live browser research is not available on the edge runtime: @browserbasehq/stagehand needs a Node runtime and cannot run on Cloudflare Workers.";

export class Stagehand {
  static create(): never {
    throw new Error(MESSAGE);
  }
  async extract(): never {
    throw new Error(MESSAGE);
  }
  async close(): never {
    throw new Error(MESSAGE);
  }
}

export const browserbase = {
  launch(): never {
    throw new Error(MESSAGE);
  },
};

export type StagehandBrowser = never;
