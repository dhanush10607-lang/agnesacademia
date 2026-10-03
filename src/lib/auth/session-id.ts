export function getAuthSessionId(accessToken: string): string {
  const payload = accessToken.split(".")[1];

  if (!payload) {
    throw new Error("The authenticated access token is malformed.");
  }

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new Error("Could not read the authenticated access token.");
  }

  if (
    typeof claims !== "object" ||
    claims === null ||
    !("session_id" in claims) ||
    typeof claims.session_id !== "string"
  ) {
    throw new Error("The authenticated access token has no session identifier.");
  }

  return claims.session_id;
}
