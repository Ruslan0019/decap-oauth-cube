export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const origin = req.query.origin || "";
  const allowed = (process.env.ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function html(body) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(body);
  }

  try {
    const code = req.query.code;
    if (!code) throw new Error("Missing code");
    if (!origin || !allowed.includes(origin)) {
      throw new Error(`Origin not allowed: ${origin}`);
    }

    const redirectUri =
      process.env.REDIRECT_URL +
      (origin ? `?origin=${encodeURIComponent(origin)}` : "");

    // Обмениваем code на токен
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    const data = await tokenRes.json();
    if (!data.access_token)
      throw new Error(data.error_description || "No token");

    // Передаём токен обратно в окно админки Decap
    const script = `
      <script>
        (function() {
          var token = ${JSON.stringify(data.access_token)};
          var origin = ${JSON.stringify(origin)};
          window.opener && window.opener.postMessage('authorization:github:success:' + token, origin);
          window.close();
        })();
      </script>`;
    html(script);
  } catch (e) {
    html(`<pre>OAuth error: ${String((e && e.message) || e)}</pre>`);
  }
}
