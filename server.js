import express from "express";

const app = express();
const port = process.env.PORT || 5007;

app.use(express.static("public"));

const APPLE_TEAM_ID = "J468ST473N";
const BUNDLE_ID = "com.beassos.app";
const APP_ID = `${APPLE_TEAM_ID}.${BUNDLE_ID}`;
const APP_SCHEME = "beassos";
const APP_STORE_URL = "https://apps.apple.com/app/beassos/id0000000000"; // à remplacer par l'ID App Store réel

app.get("/.well-known/apple-app-site-association", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send({
    applinks: {
      apps: [],
      details: [
        {
          appID: APP_ID,
          paths: ["/event/*", "/"],
          components: [
            { "/": "/event/*" },
            { "/": "/" },
          ],
        },
      ],
    },
    webcredentials: {
      apps: [APP_ID],
    },
    activitycontinuation: {
      apps: [APP_ID],
    },
  });
});

app.get("/event/:id", (req, res) => {
  const { id } = req.params;
  const deepLink = `${APP_SCHEME}://event/${id}`;
  const universalLink = `https://link.beassos.com/event/${id}`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BeAssos — Événement</title>
  <meta property="og:title" content="Rejoins cet événement sur BeAssos" />
  <meta property="og:description" content="Découvre et inscris-toi à des événements associatifs près de chez toi." />
  <meta property="og:url" content="${universalLink}" />
  <meta property="og:type" content="website" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      padding: 24px;
      background: #0f1f13;
      color: #f0faf3;
      text-align: center;
    }
    .card {
      width: 100%;
      max-width: 420px;
      background: #1a2e1e;
      border: 1px solid #2a4030;
      padding: 40px 32px;
      border-radius: 28px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .logo {
      display: block;
      width: 180px;
      height: auto;
      margin: 0 auto 24px;
      background: #fff;
      border-radius: 16px;
      padding: 12px 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #f0faf3;
      letter-spacing: -0.4px;
    }
    p {
      font-size: 15px;
      color: #7aad8a;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .btn-primary {
      display: block;
      width: 100%;
      padding: 16px 24px;
      background: #22C55E;
      color: #0f1f13;
      text-decoration: none;
      border-radius: 16px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
      margin-bottom: 12px;
    }
    .btn-primary:active { opacity: 0.85; }
    .btn-secondary {
      display: block;
      width: 100%;
      padding: 14px 24px;
      background: transparent;
      color: #7aad8a;
      text-decoration: none;
      border-radius: 16px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #2a4030;
      transition: border-color 0.15s;
    }
    .btn-secondary:hover { border-color: #22C55E; color: #22C55E; }
    .spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(15,31,19,0.3);
      border-top-color: #0f1f13;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hint {
      margin-top: 24px;
      font-size: 12px;
      color: #3d6b4a;
    }
    #statusMsg { color: #7aad8a; font-size: 14px; margin-bottom: 16px; min-height: 20px; }
    .hidden { display: none; }
  </style>
  <script>
    const deepLink = "${deepLink}";
    const storeUrl = "${APP_STORE_URL}";
    let opened = false;

    function tryOpen() {
      opened = false;
      window.location.href = deepLink;

      const start = Date.now();
      setTimeout(() => {
        if (Date.now() - start < 2500) {
          // app didn't open — probably not installed
          document.getElementById('statusMsg').textContent = "Application non détectée.";
          document.getElementById('openBtn').classList.add('hidden');
          document.getElementById('storeBtn').classList.remove('hidden');
        }
      }, 2000);
    }

    window.addEventListener('load', () => {
      setTimeout(tryOpen, 300);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) opened = true;
    });
  </script>
</head>
<body>
  <div class="card">
    <img class="logo" src="/images/logo_complete.png" alt="BeAssos" />
    <h1>Voir l'événement</h1>
    <p id="statusMsg"><span class="spinner"></span>Ouverture de l'application…</p>

    <button id="openBtn" class="btn-primary" onclick="tryOpen()">
      Ouvrir dans BeAssos
    </button>

    <a id="storeBtn" class="btn-secondary hidden" href="${APP_STORE_URL}" target="_blank">
      Télécharger BeAssos
    </a>

    <p class="hint">Partagez des événements associatifs avec vos amis.</p>
  </div>
</body>
</html>`);
});

// Fallback catch-all
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BeAssos</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100dvh; background: #0f1f13; color: #f0faf3; text-align: center; padding: 24px;
    }
    .logo { display: block; width: 200px; height: auto; margin-bottom: 16px; background: #fff; border-radius: 16px; padding: 12px 16px; }
    p { color: #7aad8a; font-size: 16px; }
  </style>
</head>
<body>
  <div>
    <img class="logo" src="/images/logo_complete.png" alt="BeAssos" />
    <p>La vie associative, simplement.</p>
  </div>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`✅ BeAssos link server running on port ${port}`);
});
