"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { CloudUpload, FileText, X } from "lucide-react";

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
};

export function ResumeCard({ file, onFileChange, existingUrl }: Props) {
  const [error, setError] = useState<string | null>(null);

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

  function handleGenerate() {
    console.log("[profile] generate resume stubbed — Feature 08 will wire this up");
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

      {error && (
        <p
          role="alert"
          className="mt-3 text-[13px] leading-5 text-error"
        >
          {error}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6 flex items-center justify-between gap-4">
        <p className="text-[14px] leading-5 text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}
