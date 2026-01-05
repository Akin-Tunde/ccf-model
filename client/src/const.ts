export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // 1. Safety check: If variables are missing, don't crash the app
  if (!oauthPortalUrl || !appId) {
    console.error("CRITICAL: VITE_OAUTH_PORTAL_URL or VITE_APP_ID is missing from environment variables.");
    return "#error-missing-config"; 
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    // 2. Ensure the URL is valid
    const url = new URL(`${oauthPortalUrl.replace(/\/$/, "")}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (e) {
    console.error("Invalid URL construction:", e);
    return "#error-invalid-url";
  }
};