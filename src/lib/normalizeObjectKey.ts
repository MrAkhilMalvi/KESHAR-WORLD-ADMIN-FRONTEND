export const normalizeObjectKey = (value?: string) => {
  if (!value) return value;

  // already objectKey
  if (!value.startsWith("http")) return value;

  try {
    const url = new URL(value);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return value;
  }
};

export const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : normalizeObjectKey(url);
};

