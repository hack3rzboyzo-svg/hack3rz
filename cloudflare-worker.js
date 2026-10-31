// Cloudflare Worker: turns a POSTed suggestion into a GitHub Issue.
//
// Why this exists: GitHub Pages only serves static files, so the page
// itself can't hold a secret. Reading suggestions back is fine without
// one (public repo issues are public), but creating an issue needs a
// token — so that part happens here instead, where the token is kept
// as a Worker secret instead of sitting in the page's source.
//
// Setup (free):
// 1. workers.cloudflare.com → sign up → Create Worker → paste this file in.
// 2. On GitHub: Settings → Developer settings → Fine-grained tokens →
//    Generate new token, scoped to ONLY the hack3rzboyzo-svg.github.io
//    repo, with "Issues: Read and write" permission and nothing else.
// 3. In the Worker: Settings → Variables → add a secret named
//    GITHUB_TOKEN with that token's value.
// 4. Deploy. Copy the workers.dev URL it gives you into WORKER_URL
//    near the top of movs.html's <script>.
// 5. On GitHub, create a label called "suggestion" on the repo (Issues
//    tab → Labels → New label) so these are easy to filter/moderate.
//    To remove a suggestion from the public list, close its issue.

const OWNER = "hack3rzboyzo-svg";
const REPO = "hack3rzboyzo-svg.github.io";
const LABEL = "suggestion";
const ALLOWED_ORIGIN = "https://hack3rzboyzo-svg.github.io";
const MAX_LENGTH = 500;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return cors(204);
    }
    if (request.method !== "POST") {
      return cors(405, { ok: false, error: "Method not allowed" });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return cors(400, { ok: false, error: "Invalid JSON" });
    }

    const text = (body.text || "").toString().trim();
    if (!text) return cors(400, { ok: false, error: "Empty suggestion" });
    if (text.length > MAX_LENGTH) {
      return cors(400, { ok: false, error: `Max ${MAX_LENGTH} characters` });
    }

    const ghResponse = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
          "Accept": "application/vnd.github+json",
          "User-Agent": "lunar-gooner-suggestions-worker",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: `Suggestion · ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
          body: text,
          labels: [LABEL]
        })
      }
    );

    if (!ghResponse.ok) {
      const detail = await ghResponse.text();
      return cors(502, { ok: false, error: "GitHub rejected the request", detail });
    }

    return cors(200, { ok: true });
  }
};

function cors(status, data) {
  return new Response(data ? JSON.stringify(data) : null, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
