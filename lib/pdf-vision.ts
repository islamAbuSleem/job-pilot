import { createCanvas, type SKRSContext2D, type Canvas } from "@napi-rs/canvas";

type RasterizedPage = {
  pageNumber: number;
  base64: string;
  width: number;
  height: number;
};

const MAX_PAGES = 4;
const RENDER_SCALE = 1.5;
const MAX_DIMENSION = 1600;

type CanvasAndContext = { canvas: Canvas; context: SKRSContext2D };

class NodeCanvasFactory {
  create(width: number, height: number): CanvasAndContext {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }
  reset(c: CanvasAndContext, width: number, height: number): void {
    c.canvas.width = width;
    c.canvas.height = height;
  }
  destroy(c: CanvasAndContext): void {
    c.canvas.width = 0;
    c.canvas.height = 0;
  }
}

function clampScale(longestSide: number): number {
  if (longestSide <= MAX_DIMENSION) return RENDER_SCALE;
  return Math.max(0.5, RENDER_SCALE * (MAX_DIMENSION / longestSide));
}

export async function rasterizePdfPages(uint8: Uint8Array): Promise<RasterizedPage[]> {
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const factory = new NodeCanvasFactory();

  const loadingTask = pdfjs.getDocument({
    data: uint8,
    disableFontFace: true,
    isEvalSupported: false,
    useSystemFonts: false,
    canvasFactory: factory,
  });

  const doc = await loadingTask.promise;
  const pageCount = Math.min(doc.numPages, MAX_PAGES);
  const pages: RasterizedPage[] = [];

  try {
    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = clampScale(Math.max(baseViewport.width, baseViewport.height));
      const viewport = page.getViewport({ scale });

      const canvasAndContext = factory.create(viewport.width, viewport.height);
      canvasAndContext.context.fillStyle = "#ffffff";
      canvasAndContext.context.fillRect(0, 0, viewport.width, viewport.height);

      await page.render({
        canvasContext: canvasAndContext.context as unknown as CanvasRenderingContext2D,
        canvas: canvasAndContext.canvas as unknown as HTMLCanvasElement,
        viewport,
        canvasFactory: factory,
      }).promise;

      const png = canvasAndContext.canvas.toBuffer("image/png");
      pages.push({
        pageNumber: i,
        base64: png.toString("base64"),
        width: Math.ceil(viewport.width),
        height: Math.ceil(viewport.height),
      });
      await page.cleanup();
      factory.destroy(canvasAndContext);
    }
  } finally {
    await doc.cleanup();
  }

  return pages;
}