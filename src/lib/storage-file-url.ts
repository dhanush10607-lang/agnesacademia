export function getPublicResourceFileUrl(filePath: string, download = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required to link resource files.");
  }

  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const url = new URL(`/storage/v1/object/public/resources/${encodedPath}`, supabaseUrl);

  if (download) {
    const filename = filePath.split("/").pop() || "download";
    url.searchParams.set("download", filename);
  }

  return url.toString();
}
