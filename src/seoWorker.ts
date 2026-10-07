// Lectura completa de la wiki para IAs, buscadores y cualquier cliente sin JavaScript.
//
// La SPA de Dragopedia solo entrega un "Cargando..." hasta que React arranca, así que un
// lector de enlaces (ChatGPT, Claude, Perplexity, curl...) no veía nada del artículo.
// Este módulo, que corre en el worker de Cloudflare, responde con el contenido ya escrito:
//   - /articulo/<slug> (y alias)  -> HTML con el artículo entero dentro de <div id="root">
//   - /articulo/<slug>.md | .txt | .json  (o ?format=md|txt|json) -> texto limpio
//   - /categoria/<slug> y /          -> listado de artículos con enlaces
//   - /llms.txt, /llms-full.txt, /sitemap.xml, /robots.txt
//
// IMPORTANTE: solo se publican campos públicos del artículo. Notas del DM (dm_notes),
// borradores u otros campos internos NO se incluyen nunca.

interface Fetcher {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export interface SeoEnv {
  ASSETS: Fetcher;
}

interface Article {
  id?: string;
  slug: string;
  title: string;
  category?: string;
  summary?: string;
  content?: string;
  tags?: string[];
  author?: string;
  created_date?: string;
  updated_date?: string;
  image_url?: string;
  cover_image?: string;
}

interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

type Format = "html" | "md" | "txt" | "json";

const SITE_NAME = "Dragopedia";
const SITE_TAGLINE = "El Libro de Tarot de Caldo de Dragón";
const ARTICLE_PREFIXES = ["articulo", "articulos", "tomo", "tomos", "wiki/articulo", "wiki"];

// ---------------------------------------------------------------------------
// Utilidades de texto
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html: string): string {
  return (html || "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToMarkdown(html: string): string {
  if (!html) return "";
  let md = html;
  md = md.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  md = md.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  for (let i = 1; i <= 6; i++) {
    md = md.replace(new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\\/h${i}>`, "gi"), `\n\n${"#".repeat(i)} $1\n\n`);
  }
  md = md.replace(/<(?:b|strong)[^>]*>([\s\S]*?)<\/(?:b|strong)>/gi, "**$1**");
  md = md.replace(/<(?:i|em)[^>]*>([\s\S]*?)<\/(?:i|em)>/gi, "*$1*");
  md = md.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img\b[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img\b[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, "![]($1)");
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n");
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, p1: string) =>
    "\n" + p1.trim().split("\n").map((l) => `> ${l.trim()}`).join("\n") + "\n\n"
  );
  // Tablas: una fila por línea, celdas separadas por " | "
  md = md.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_m, row: string) => {
    const cells = [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => c[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    return "\n" + cells.join(" | ") + "\n";
  });
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
  md = md.replace(/<[^>]+>/g, "");
  md = md
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

// ---------------------------------------------------------------------------
// Carga de datos (assets estáticos del propio despliegue)
// ---------------------------------------------------------------------------

function normalizeArticle(raw: any): Article | null {
  if (!raw || typeof raw.slug !== "string" || !raw.slug || typeof raw.title !== "string") return null;
  let tags: string[] = [];
  if (Array.isArray(raw.tags)) tags = raw.tags.map(String);
  else if (typeof raw.tags === "string") {
    try {
      const p = JSON.parse(raw.tags);
      if (Array.isArray(p)) tags = p.map(String);
    } catch {}
  }
  // Lista blanca de campos públicos: nada de dm_notes ni datos internos.
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    category: raw.category,
    summary: raw.summary,
    content: raw.content,
    tags,
    author: raw.author,
    created_date: raw.created_date,
    updated_date: raw.updated_date,
    image_url: raw.image_url,
    cover_image: raw.cover_image,
  };
}

async function loadJson(env: SeoEnv, origin: string, path: string): Promise<any> {
  try {
    const res = await env.ASSETS.fetch(new Request(new URL(path, origin).toString()));
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadArticles(env: SeoEnv, origin: string): Promise<Article[]> {
  const raw = await loadJson(env, origin, "/data/articles.json");
  const list: any[] = Array.isArray(raw) ? raw : (raw && raw.articles) || [];
  return list.map(normalizeArticle).filter((a): a is Article => !!a);
}

async function loadCategories(env: SeoEnv, origin: string): Promise<Category[]> {
  const raw = await loadJson(env, origin, "/data/categories.json");
  const list: any[] = Array.isArray(raw) ? raw : (raw && raw.categories) || [];
  return list.filter((c) => c && c.name && c.slug);
}

function categoryLabel(article: Article, cats: Category[]): string {
  const c = cats.find((x) => x.id === article.category || x.slug === article.category || x.name === article.category);
  return c ? c.name : article.category || "General";
}

function slugifyCategory(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findArticle(articles: Article[], rawSlug: string): Article | undefined {
  const s = rawSlug.toLowerCase();
  return articles.find(
    (a) =>
      a.slug === rawSlug ||
      a.id === rawSlug ||
      a.slug.toLowerCase() === s ||
      a.title.toLowerCase() === s ||
      a.title.toLowerCase().replace(/\s+/g, "-") === s
  );
}

// ---------------------------------------------------------------------------
// Plantilla HTML
// ---------------------------------------------------------------------------

async function loadTemplate(env: SeoEnv, origin: string): Promise<string> {
  const res = await env.ASSETS.fetch(new Request(new URL("/", origin).toString()));
  return await res.text();
}

function setMeta(html: string, attr: "name" | "property", key: string, content: string): string {
  if (!content) return html;
  const re = new RegExp(`<meta\\s+${attr}=["']${key}["'][^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, () => tag);
  return html.replace(/<\/head>/i, () => `  ${tag}\n</head>`);
}

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type: "website" | "article";
  jsonLd?: unknown;
}

function absoluteImage(origin: string, img?: string): string {
  if (!img) return `${origin}/images/og/grafo-hub.png`;
  if (/^https?:\/\//i.test(img)) return img;
  return `${origin}${img.startsWith("/") ? "" : "/"}${img}`;
}

// Sustituye el contenido de <div id="root"> por HTML ya renderizado.
// No se usa una regex no-greedy porque el loader del index tiene <div> anidados.
function injectPage(template: string, meta: PageMeta, body: string): string {
  let html = template;
  html = /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${esc(meta.title)}</title>`)
    : html.replace(/<\/head>/i, () => `<title>${esc(meta.title)}</title>\n</head>`);

  const canonical = `<link rel="canonical" href="${esc(meta.canonical)}" />`;
  html = /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, () => canonical)
    : html.replace(/<\/head>/i, () => `  ${canonical}\n</head>`);

  html = setMeta(html, "name", "description", meta.description);
  html = setMeta(html, "property", "og:site_name", SITE_NAME);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:url", meta.canonical);
  html = setMeta(html, "property", "og:type", meta.type);
  if (meta.image) {
    html = setMeta(html, "property", "og:image", meta.image);
    html = setMeta(html, "name", "twitter:image", meta.image);
  }
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.description);

  if (meta.jsonLd) {
    const ld = `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`;
    html = html.replace(/<\/head>/i, () => `  ${ld}\n</head>`);
  }

  const start = html.indexOf('<div id="root"');
  if (start === -1) return html;
  const openEnd = html.indexOf(">", start) + 1;
  const bodyEnd = html.indexOf("</body>", openEnd);
  const limit = bodyEnd === -1 ? html.length : bodyEnd;
  const nextScript = html.indexOf("<script", openEnd);
  const searchEnd = nextScript !== -1 && nextScript < limit ? nextScript : limit;
  const closeIdx = html.lastIndexOf("</div>", searchEnd);
  if (closeIdx < openEnd) return html;
  return html.slice(0, openEnd) + body + html.slice(closeIdx);
}

const WRAP_STYLE =
  "font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 860px; margin: 0 auto; padding: 2rem 1.25rem; color: #e2e8f0; background: #070e14; line-height: 1.65;";

function renderArticleBody(a: Article, cat: string, related: Article[]): string {
  const content = (a.content || "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  const img = a.cover_image || a.image_url;
  return `<article class="dragopedia-article-ssr" style="${WRAP_STYLE}">
  <nav aria-label="Migas de pan"><a href="/">Inicio</a> / <a href="/categoria/${esc(slugifyCategory(cat))}">${esc(cat)}</a></nav>
  <header>
    <h1>${esc(a.title)}</h1>
    <p><strong>Categoría:</strong> ${esc(cat)}${a.author ? ` · <strong>Autor:</strong> ${esc(a.author)}` : ""}${a.updated_date ? ` · <strong>Actualizado:</strong> <time datetime="${esc(a.updated_date)}">${esc(a.updated_date.slice(0, 10))}</time>` : ""}</p>
    ${a.summary ? `<p><em>${esc(a.summary)}</em></p>` : ""}
  </header>
  ${img ? `<figure><img src="${esc(img)}" alt="${esc(a.title)}" style="max-width:100%;height:auto" /></figure>` : ""}
  <div class="dragopedia-article-content">${content}</div>
  ${a.tags && a.tags.length ? `<p><strong>Etiquetas:</strong> ${a.tags.map((t) => esc(t)).join(", ")}</p>` : ""}
  ${related.length ? `<section><h2>Artículos relacionados</h2><ul>${related.map((r) => `<li><a href="/articulo/${encodeURIComponent(r.slug)}">${esc(r.title)}</a></li>`).join("")}</ul></section>` : ""}
  <footer><p>${SITE_NAME} — ${SITE_TAGLINE}. <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">Mapa del sitio</a> · <a href="/articulo/${encodeURIComponent(a.slug)}.md">Versión Markdown</a></p></footer>
</article>`;
}

function renderListBody(title: string, intro: string, groups: { name: string; articles: Article[] }[]): string {
  return `<main class="dragopedia-index-ssr" style="${WRAP_STYLE}">
  <h1>${esc(title)}</h1>
  <p>${esc(intro)}</p>
  ${groups
    .map(
      (g) => `<section><h2>${esc(g.name)}</h2><ul>${g.articles
        .map((a) => `<li><a href="/articulo/${encodeURIComponent(a.slug)}">${esc(a.title)}</a>${a.summary ? ` — ${esc(a.summary.slice(0, 140))}` : ""}</li>`)
        .join("")}</ul></section>`
    )
    .join("\n")}
  <footer><p><a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">Texto completo</a> · <a href="/sitemap.xml">Mapa del sitio</a></p></footer>
</main>`;
}

// ---------------------------------------------------------------------------
// Formatos de texto
// ---------------------------------------------------------------------------

function articleToMarkdown(a: Article, cat: string, origin: string): string {
  return [
    `# ${a.title}`,
    "",
    `> **Categoría:** ${cat}  `,
    `> **URL:** ${origin}/articulo/${encodeURIComponent(a.slug)}  `,
    a.author ? `> **Autor:** ${a.author}  ` : "",
    a.created_date ? `> **Publicado:** ${a.created_date.slice(0, 10)}  ` : "",
    a.updated_date ? `> **Actualizado:** ${a.updated_date.slice(0, 10)}  ` : "",
    a.tags && a.tags.length ? `> **Etiquetas:** ${a.tags.join(", ")}  ` : "",
    a.summary ? `\n*${a.summary}*\n` : "",
    "---",
    "",
    htmlToMarkdown(a.content || ""),
  ]
    .filter((l) => l !== "")
    .join("\n");
}

function generateLlmsTxt(articles: Article[], cats: Category[], origin: string): string {
  const lines = [
    `# ${SITE_NAME} — ${SITE_TAGLINE}`,
    "",
    "> Enciclopedia del universo narrativo y de rol de Caldo de Dragón: personajes, lugares, dioses, magias, planos y más.",
    "",
    "Cada artículo se puede leer completo añadiendo `.md` a su URL (por ejemplo `/articulo/<slug>.md`).",
    "",
    "## Secciones",
    `- [Inicio](${origin}/)`,
    `- [Texto completo de toda la wiki](${origin}/llms-full.txt): todos los artículos en un solo documento Markdown`,
    `- [Mapa del sitio](${origin}/sitemap.xml)`,
  ];
  const groups = new Map<string, Article[]>();
  for (const a of articles) {
    const c = categoryLabel(a, cats);
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c)!.push(a);
  }
  lines.push("", "## Artículos");
  for (const [c, list] of groups) {
    lines.push("", `### ${c}`);
    for (const a of list) {
      const s = a.summary ? `: ${stripHtml(a.summary).slice(0, 120)}` : "";
      lines.push(`- [${a.title}](${origin}/articulo/${encodeURIComponent(a.slug)}.md)${s}`);
    }
  }
  return lines.join("\n");
}

function generateLlmsFullTxt(articles: Article[], cats: Category[], origin: string): string {
  const blocks = [
    `# ${SITE_NAME} — Compendio completo de Caldo de Dragón`,
    `Total de artículos: ${articles.length}`,
  ];
  for (const a of articles) {
    blocks.push(
      [
        `\n## ${a.title}`,
        `URL: ${origin}/articulo/${encodeURIComponent(a.slug)}`,
        `Categoría: ${categoryLabel(a, cats)}`,
        a.tags && a.tags.length ? `Etiquetas: ${a.tags.join(", ")}` : "",
        a.summary ? `Resumen: ${a.summary}` : "",
        "",
        htmlToMarkdown(a.content || ""),
        "\n" + "-".repeat(60),
      ]
        .filter((l) => l !== "")
        .join("\n")
    );
  }
  return blocks.join("\n\n");
}

function generateSitemap(articles: Article[], cats: Category[], origin: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls: string[] = [`  <url><loc>${origin}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`];
  for (const c of cats) {
    urls.push(`  <url><loc>${origin}/categoria/${encodeURIComponent(c.slug)}</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>`);
  }
  for (const a of articles) {
    const last = (a.updated_date || a.created_date || today).slice(0, 10);
    urls.push(`  <url><loc>${origin}/articulo/${encodeURIComponent(a.slug)}</loc><lastmod>${last}</lastmod><priority>0.8</priority></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

function generateRobots(origin: string): string {
  return [
    `# robots.txt de ${SITE_NAME}`,
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /dm-sanctum",
    "Disallow: /dm",
    "Disallow: /editar/",
    "Disallow: /nuevo",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    `# Para modelos de lenguaje: ${origin}/llms.txt`,
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Enrutado
// ---------------------------------------------------------------------------

const TEXT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300",
};

function textResponse(body: string, type: string, status = 200): Response {
  return new Response(body, { status, headers: { "Content-Type": type, ...TEXT_HEADERS } });
}

function matchArticleRoute(pathname: string): { slug: string; format: Format } | null {
  for (const prefix of ARTICLE_PREFIXES) {
    const p = `/${prefix}/`;
    if (!pathname.startsWith(p)) continue;
    let rest = pathname.slice(p.length).replace(/\/$/, "");
    if (!rest || rest.includes("/")) continue;
    try {
      rest = decodeURIComponent(rest);
    } catch {}
    let format: Format = "html";
    const m = rest.match(/\.(md|markdown|txt|json|html?)$/i);
    if (m) {
      const ext = m[1].toLowerCase();
      format = ext === "json" ? "json" : ext === "txt" ? "txt" : ext.startsWith("htm") ? "html" : "md";
      rest = rest.slice(0, -(m[0].length));
    }
    return { slug: rest, format };
  }
  return null;
}

/**
 * Devuelve una respuesta si la ruta es una de las que se sirven pre-renderizadas,
 * o null para que el worker siga con su comportamiento normal (assets / SPA).
 */
export async function handleSeoRequest(request: Request, env: SeoEnv): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  if (pathname === "/robots.txt") return textResponse(generateRobots(origin), "text/plain; charset=utf-8");

  if (pathname === "/sitemap.xml" || pathname === "/llms.txt" || pathname === "/llms-full.txt") {
    const [articles, cats] = await Promise.all([loadArticles(env, origin), loadCategories(env, origin)]);
    if (pathname === "/sitemap.xml") return textResponse(generateSitemap(articles, cats, origin), "application/xml; charset=utf-8");
    if (pathname === "/llms.txt") return textResponse(generateLlmsTxt(articles, cats, origin), "text/plain; charset=utf-8");
    return textResponse(generateLlmsFullTxt(articles, cats, origin), "text/plain; charset=utf-8");
  }

  const route = matchArticleRoute(pathname);
  if (route) {
    const q = (url.searchParams.get("format") || "").toLowerCase();
    let format = route.format;
    if (q === "md" || q === "markdown") format = "md";
    else if (q === "txt" || q === "text") format = "txt";
    else if (q === "json") format = "json";
    else if (q === "html") format = "html";
    else if (!q && format === "html") {
      const accept = request.headers.get("accept") || "";
      if (accept.includes("text/markdown")) format = "md";
      else if (accept.includes("application/json") && !accept.includes("text/html")) format = "json";
    }

    const [articles, cats] = await Promise.all([loadArticles(env, origin), loadCategories(env, origin)]);
    const article = findArticle(articles, route.slug);
    if (!article) return null; // la SPA muestra su propia pantalla de "no encontrado"

    const cat = categoryLabel(article, cats);
    if (format === "json") {
      return new Response(JSON.stringify({ article: { ...article, category_name: cat }, url: `${origin}/articulo/${encodeURIComponent(article.slug)}` }), {
        headers: { "Content-Type": "application/json; charset=utf-8", ...TEXT_HEADERS },
      });
    }
    if (format === "md" || format === "txt") {
      return textResponse(articleToMarkdown(article, cat, origin), format === "md" ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8");
    }

    const related = articles.filter((x) => x.slug !== article.slug && categoryLabel(x, cats) === cat).slice(0, 6);
    const canonical = `${origin}/articulo/${encodeURIComponent(article.slug)}`;
    const description = article.summary ? stripHtml(article.summary) : stripHtml(article.content || "").slice(0, 200);
    const template = await loadTemplate(env, origin);
    const html = injectPage(
      template,
      {
        title: `${article.title} - ${SITE_NAME} | ${SITE_TAGLINE}`,
        description,
        canonical,
        image: absoluteImage(origin, article.cover_image || article.image_url),
        type: "article",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description,
          inLanguage: "es",
          datePublished: article.created_date,
          dateModified: article.updated_date || article.created_date,
          articleSection: cat,
          mainEntityOfPage: canonical,
        },
      },
      renderArticleBody(article, cat, related)
    );
    return new Response(request.method === "HEAD" ? null : html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" },
    });
  }

  const catMatch = pathname.match(/^\/categoria\/([^/]+)\/?$/);
  if (pathname === "/" || catMatch) {
    const [articles, cats] = await Promise.all([loadArticles(env, origin), loadCategories(env, origin)]);
    let groups: { name: string; articles: Article[] }[] = [];
    let title = `${SITE_NAME} — ${SITE_TAGLINE}`;
    let intro = "Enciclopedia del universo de Caldo de Dragón. Todos los artículos, por categoría.";
    let canonical = `${origin}/`;

    if (catMatch) {
      let slug = catMatch[1];
      try {
        slug = decodeURIComponent(slug);
      } catch {}
      const cat = cats.find((c) => c.slug === slug || c.id === slug);
      if (!cat) return null;
      const list = articles.filter((a) => categoryLabel(a, cats) === cat.name);
      groups = [{ name: cat.name, articles: list }];
      title = `${cat.name} - ${SITE_NAME}`;
      intro = cat.description || `Artículos de la categoría ${cat.name}.`;
      canonical = `${origin}/categoria/${encodeURIComponent(cat.slug)}`;
    } else {
      const map = new Map<string, Article[]>();
      for (const a of articles) {
        const c = categoryLabel(a, cats);
        if (!map.has(c)) map.set(c, []);
        map.get(c)!.push(a);
      }
      groups = [...map].map(([name, list]) => ({ name, articles: list }));
    }

    const template = await loadTemplate(env, origin);
    const html = injectPage(template, { title, description: intro, canonical, type: "website" }, renderListBody(title, intro, groups));
    return new Response(request.method === "HEAD" ? null : html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" },
    });
  }

  return null;
}
