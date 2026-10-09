#!/usr/bin/env node
// Descarga al repositorio todas las imágenes de artículos que sigan en servidores externos
// (Imgur, Fandom, ArtStation, spellbookdnd.com, bg3.wiki, ...) y reescribe los datos para que
// apunten a la copia local. Así la wiki nunca depende de un tercero (bloqueos por región,
// enlaces caídos, hotlink protection...).
//
// Uso (desde la raíz del proyecto, en un equipo con acceso a internet):
//   node scripts/localize_article_images.mjs            descarga y reescribe
//   node scripts/localize_article_images.mjs --check    solo informa; sale con error si queda alguna externa
//   node scripts/localize_article_images.mjs --root=ruta   otra raíz de proyecto (pruebas)
//
// Campos que revisa: image_url, gallery, monster_images, spell_images y timeline_markers[].image_url.
// Los mapas (map_url) son páginas interactivas de CartoCraft, no imágenes: este script no los toca.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const rootArg = args.find((a) => a.startsWith("--root="));
const ROOT = rootArg ? path.resolve(rootArg.slice(7)) : process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "downloaded");
const DATA_FILES = [
  "public/data/articles.json",
  "src/data/articles.json",
  "public/data/seed_articles.json",
  "src/data/seed_articles.json",
].map((f) => path.join(ROOT, f));

const isExternal = (v) => typeof v === "string" && /^https?:\/\//i.test(v.trim());

// Aplica fn a cada campo de imagen de un artículo; fn devuelve el valor nuevo (o el mismo).
function mapImageFields(article, fn) {
  const out = { ...article };
  if (isExternal(out.image_url)) out.image_url = fn(out.image_url);
  if (Array.isArray(out.gallery)) {
    out.gallery = out.gallery.map((g) =>
      typeof g === "string" ? (isExternal(g) ? fn(g) : g) : g && isExternal(g.url) ? { ...g, url: fn(g.url) } : g
    );
  }
  for (const key of ["monster_images", "spell_images"]) {
    const obj = out[key];
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      out[key] = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, isExternal(v) ? fn(v) : v]));
    }
  }
  if (Array.isArray(out.timeline_markers)) {
    out.timeline_markers = out.timeline_markers.map((m) => (m && isExternal(m.image_url) ? { ...m, image_url: fn(m.image_url) } : m));
  }
  return out;
}

const load = (file) => {
  const text = fs.readFileSync(file, "utf8");
  const data = JSON.parse(text);
  const list = Array.isArray(data) ? data : data.articles;
  return { text, data, list, wrapped: !Array.isArray(data) };
};

const files = DATA_FILES.filter((f) => fs.existsSync(f)).map((f) => ({ file: f, ...load(f) }));
const urls = new Set();
for (const f of files) for (const a of f.list) mapImageFields(a, (u) => (urls.add(u.trim()), u));

console.log(`Imágenes externas encontradas: ${urls.size} (en ${files.length} archivos de datos)`);
if (CHECK) {
  for (const u of [...urls].slice(0, 25)) console.log("  -", u);
  if (urls.size > 25) console.log(`  ... y ${urls.size - 25} más`);
  process.exit(urls.size ? 1 : 0);
}
if (!urls.size) process.exit(0);

const EXT_BY_TYPE = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "image/svg+xml": ".svg" };
fs.mkdirSync(OUT_DIR, { recursive: true });

async function download(url) {
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 14);
  const existing = fs.readdirSync(OUT_DIR).find((n) => n.startsWith(hash + "."));
  if (existing) return `/images/downloaded/${existing}`;
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: { "User-Agent": "Mozilla/5.0 (Dragopedia image archiver)", Accept: "image/*,*/*;q=0.8" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const buf = Buffer.from(await res.arrayBuffer());
  if (!type.startsWith("image/")) throw new Error(`no es una imagen (${type || "sin tipo"})`);
  if (buf.length < 200) throw new Error("archivo demasiado pequeño");
  const ext = EXT_BY_TYPE[type] || path.extname(new URL(url).pathname).toLowerCase() || ".img";
  const name = hash + ext;
  fs.writeFileSync(path.join(OUT_DIR, name), buf);
  return `/images/downloaded/${name}`;
}

const map = new Map();
const failed = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      try {
        map.set(u, await download(u));
      } catch (e) {
        failed.push([u, e.message]);
      }
      if ((map.size + failed.length) % 50 === 0) console.log(`  ${map.size + failed.length}/${urls.size}`);
    }
  })
);

for (const f of files) {
  const list = f.list.map((a) => mapImageFields(a, (u) => map.get(u.trim()) || u));
  const out = JSON.stringify(f.wrapped ? { ...f.data, articles: list } : list, null, 2) + (f.text.endsWith("\n") ? "\n" : "");
  if (out !== f.text) fs.writeFileSync(f.file, out);
}

console.log(`Descargadas: ${map.size} | Fallidas: ${failed.length}`);
for (const [u, why] of failed) console.log(`  ✗ ${u} -> ${why}`);
process.exit(failed.length ? 1 : 0);
