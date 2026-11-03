import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = "suggestions.json";
if (!existsSync(FILE)) { writeFileSync("map.svg", "<svg xmlns='http://www.w3.org/2000/svg'/>"); process.exit(0); }

const items = JSON.parse(readFileSync(FILE, "utf8"));
const pts = items.filter(i => i.meta && i.meta.lat != null).map(i => [+i.meta.lat, +i.meta.lon]);

const W = 1200, H = 600;
const x = lon => ((lon + 180) / 360) * W;
const y = lat => ((90 - lat) / 180) * H;

const cells = new Map();
for (const [lat, lon] of pts) {
  const k = `${Math.round(lat)},${Math.round(lon)}`;
  cells.set(k, (cells.get(k) || 0) + 1);
}

let circles = "";
for (const [k, n] of cells) {
  const [lat, lon] = k.split(",").map(Number);
  const r = Math.min(4 + Math.sqrt(n) * 4, 24);
  circles += `<circle cx="${x(lon).toFixed(1)}" cy="${y(lat).toFixed(1)}" r="${r.toFixed(1)}" fill="#4af" fill-opacity=".3" stroke="#4af"/>`;
}

const grid = [
  ...[...Array(11)].map((_, i) => `<line x1="${(i * W) / 12}" y1="0" x2="${(i * W) / 12}" y2="${H}"/>`),
  ...[...Array(5)].map((_, i) => `<line x1="0" y1="${(i * H) / 6}" x2="${W}" y2="${(i * H) / 6}"/>`)
].join("");

writeFileSync("map.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#0b0f14"/>
<g stroke="#1b2530">${grid}</g>
<g>${circles}</g>
<text x="16" y="28" fill="#6b7b8c" font-family="monospace" font-size="15">${cells.size} locations · ${pts.length} geotagged of ${items.length} submissions</text>
</svg>`);
