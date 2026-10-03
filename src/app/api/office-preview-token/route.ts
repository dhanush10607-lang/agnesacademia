import { createHmac } from "node:crypto";

const MAX_FILE_PATH_LENGTH = 1200;
const TICKET_LIFETIME_SECONDS = 5 * 60;

function isValidOfficeFilePath(filePath: unknown): filePath is string {
  if (typeof filePath !== "string" || filePath.length === 0 || filePath.length > MAX_FILE_PATH_LENGTH) {
    return false;
  }

  const segments = filePath.split("/");
  return (
    !filePath.startsWith("/") &&
    !filePath.includes("\\") &&
    !filePath.includes("\0") &&
    segments.every((segment) => segment !== "" && segment !== "." && segment !== "..") &&
    /\.(docx?|pptx?)$/i.test(filePath)
  );
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Office preview tickets must be requested from this site." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "A valid JSON request is required." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("filePath" in body) ||
    !isValidOfficeFilePath(body.filePath)
  ) {
    return Response.json({ error: "The requested file is not a supported Office document." }, { status: 400 });
  }

  const secret = process.env.OFFICE_PREVIEW_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    console.error("OFFICE_PREVIEW_TOKEN_SECRET must contain at least 32 characters.");
    return Response.json({ error: "Office previews are not configured." }, { status: 503 });
  }

  const payload = Buffer.from(
    JSON.stringify({
      path: body.filePath,
      exp: Math.floor(Date.now() / 1000) + TICKET_LIFETIME_SECONDS,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return Response.json(
    { ticket: `${payload}.${signature}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}
