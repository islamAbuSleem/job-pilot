export function extractResumePath(
  stored: string | null | undefined,
  userId?: string,
): string | null {
  if (!stored) return null;
  let path = stored;
  if (stored.startsWith("http")) {
    try {
      const url = new URL(stored);
      const objIdx = url.pathname.indexOf("/objects/");
      if (objIdx !== -1) {
        path = decodeURIComponent(url.pathname.slice(objIdx + "/objects/".length));
      } else {
        const idx = url.pathname.indexOf("/resumes/");
        if (idx !== -1) {
          const after = url.pathname.slice(idx + "/resumes/".length);
          path = decodeURIComponent(after.replace(/^objects\//, ""));
        } else {
          const parts = url.pathname.split("/");
          const last = parts[parts.length - 1];
          if (last) path = `${userId ?? ""}/${decodeURIComponent(last)}`;
        }
      }
    } catch {
      path = stored;
    }
  }
  return path || null;
}