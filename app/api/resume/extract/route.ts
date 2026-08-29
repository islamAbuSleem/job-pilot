import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { extractProfileFromResumeWithRetry, extractProfileFromResumeVision } from "@/lib/openrouter";
import { rasterizePdfPages } from "@/lib/pdf-vision";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File must be smaller than 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    let extractedText = "";
    let textExtractionFailed = false;
    let textExtractionDetail = "";

    try {
      const parser = new PDFParse({ data: uint8 });
      const result = await parser.getText();
      extractedText = result.text?.trim() ?? "";
      await parser.destroy();
    } catch (error) {
      console.error("[extract] pdf-parse failed:", error);
      textExtractionFailed = true;
      textExtractionDetail = error instanceof Error ? error.message : String(error);
    }

    if (!textExtractionFailed && extractedText && extractedText.length >= 50) {
const result = await extractProfileFromResumeWithRetry(extractedText);
    if (!result.success) {
      console.error("[extract] text extraction failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error:
            result.error ??
            "We couldn't read the structured data from your resume. The AI service may be temporarily unavailable — please try again in a moment.",
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true, data: result.data, source: "text" });
    }

    // Text extraction failed or returned too little — fall back to a vision-capable model.
    console.log(
      `[extract] Text extraction insufficient (failed=${textExtractionFailed}, length=${extractedText.length}); using vision fallback`,
    );

    let pages: Awaited<ReturnType<typeof rasterizePdfPages>>;
    try {
      pages = await rasterizePdfPages(uint8);
    } catch (error) {
      console.error("[extract] PDF rasterization failed:", error);
      const message =
        textExtractionFailed
          ? `Could not extract text from this PDF (${textExtractionDetail}) and vision fallback failed: ${error instanceof Error ? error.message : String(error)}`
          : `Could not extract text from this PDF (it may be a scanned/image-based PDF with no selectable text), and vision fallback failed to rasterize the file: ${error instanceof Error ? error.message : String(error)}`;
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    if (pages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract text from this PDF. It may be empty or corrupted.",
        },
        { status: 400 },
      );
    }

    const visionResult = await extractProfileFromResumeVision(
      pages.map((p) => ({ pageNumber: p.pageNumber, base64: p.base64 })),
    );

    if (!visionResult.success) {
      console.error("[extract] vision extraction failed:", visionResult.error);
      return NextResponse.json(
        {
          success: false,
          error:
            visionResult.error ??
            "We couldn't read your resume, even with our vision fallback. The PDF may be malformed or the AI service is temporarily unavailable — please try a different file.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, data: visionResult.data, source: "vision" });
  } catch (error) {
    console.error("[extract] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}