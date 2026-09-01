"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { CloudUpload, FileText, X, Sparkles, Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingUrl?: string | null;
  canDelete?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  generateError?: string | null;
};

export function ResumeCard({ file, onFileChange, existingUrl, canDelete, isDeleting, onDelete, onGenerate, isGenerating, generateError }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setError(null);
      if (rejections.length > 0) {
        const first = rejections[0];
        if (first.errors[0]?.code === "file-too-large") {
          setError("File is larger than 5 MB. Please upload a smaller PDF.");
        } else if (first.errors[0]?.code === "file-invalid-type") {
          setError("Only PDF files are accepted.");
        } else {
          setError("Could not accept this file. Please try another.");
        }
        return;
      }
      if (accepted.length > 0) {
        onFileChange(accepted[0]);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  function clear() {
    onFileChange(null);
    setError(null);
  }

  async function handleExtract() {
    if (!file || isExtracting) return;
    setError(null);
    setIsExtracting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resume/extract", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Extraction failed");
      // The parent ProfileEditor will handle populating the form
      // via a custom window event
      window.dispatchEvent(new CustomEvent("resume-extracted", { detail: json.data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
        Resume
      </h2>
      <p className="mt-1 text-[14px] leading-5 text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new
        tailored one from your details below.
      </p>

      {file ? (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-secondary px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 shrink-0 text-text-secondary" />
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-5 text-text-primary truncate">
                {file.name}
              </p>
              <p className="text-[12px] leading-4 text-text-muted">
                {formatBytes(file.size)} · Ready to upload on Save
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label="Remove file"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : existingUrl ? (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-secondary px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 shrink-0 text-text-secondary" />
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-5 text-text-primary truncate">Current resume</p>
              <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] leading-4 text-accent hover:underline">
                View PDF
              </a>
            </div>
          </div>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              aria-label="Remove saved resume"
              className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-text-muted hover:text-error hover:bg-error-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? <span className="text-[13px]">Removing…</span> : null}
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`mt-6 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
            isDragActive
              ? "border-accent bg-accent-muted"
              : "border-border bg-surface-secondary"
          }`}
        >
          <input {...getInputProps()} />
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-light text-accent">
            <CloudUpload className="w-5 h-5" />
          </div>
          <p className="mt-2 text-[14px] font-medium leading-5 text-text-primary">
            Click to upload or drag and drop
          </p>
          <p className="text-[12px] leading-4 text-text-muted">
            PDF formatting only. Maximum file size 5MB.
          </p>
          <button
            type="button"
            onClick={open}
            className="mt-3 inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-[14px] font-medium leading-5 text-text-primary hover:bg-surface-secondary transition-colors"
          >
            Select Resume
          </button>
        </div>
      )}

      {(error || generateError) && (
        <p
          role="alert"
          className="mt-3 text-[13px] leading-5 text-error"
        >
          {generateError ?? error}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[14px] leading-5 text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {file && !isExtracting && (
            <button
              type="button"
              onClick={handleExtract}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-[14px] font-medium leading-5 text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Extract from Resume
            </button>
          )}
          {isExtracting && (
            <span className="inline-flex items-center gap-2 text-[14px] leading-5 text-text-secondary">
              <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Extracting...
            </span>
          )}
          {isGenerating ? (
            <span className="inline-flex items-center gap-2 text-[14px] leading-5 text-text-secondary">
              <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={!onGenerate}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generate Resume from Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}