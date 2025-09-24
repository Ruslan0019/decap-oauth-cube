export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const scopes = process.env.SCOPES || "public_repo"; // или "repo" если репо приватный
  const redirect = process.env.REDIRECT_URL; // https://decap-oauth-cube.vercel.app/callback
  const origin = req.query.origin || "";

  // GitHub вернёт обратно в /callback
  const redirectWithOrigin =
    redirect + (origin ? `?origin=${encodeURIComponent(origin)}` : "");

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectWithOrigin)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&allow_signup=true`;

  res.writeHead(302, { Location: url });
  res.end();
}
