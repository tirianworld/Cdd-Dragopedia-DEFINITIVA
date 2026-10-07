interface Env {
  ASSETS: Fetcher;
  BACKEND_URL?: string;
  [key: string]: unknown;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "*",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

function stripHtml(s: string): string {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function tarotCheck(env: Env, request: Request, body: any) {
  const { title, category, content, summary, currentSlug } = body || {};
  const clean = stripHtml(String(content || ""));
  if (!clean) return { issues: [], checkedAgainstCount: 0 };

  let raw: any = [];
  try {
    const res = await env.ASSETS.fetch(new Request(new URL("/data/articles.json", request.url)));
    raw = await res.json();
  } catch {}
  const all: any[] = Array.isArray(raw) ? raw : (raw && raw.articles) || [];
  const others = all.filter((a) => a && a.slug !== currentSlug);

  const text = (String(title || "") + " " + clean.slice(0, 1500)).toLowerCase();
  const words = new Set(text.split(/[^a-z0-9\u00e0-\u00ff]+/).filter((w) => w.length > 3));
  const scored = others.map((a) => {
    const t = String(a.title || "").toLowerCase();
    let score = t && text.includes(t) ? 10 : 0;
    for (const w of t.split(/[^a-z0-9\u00e0-\u00ff]+/)) if (w.length > 3 && words.has(w)) score++;
    return { a, score };
  }).sort((x, y) => y.score - x.score);
  const picked = (scored.some((s) => s.score > 0) ? scored.filter((s) => s.score > 0) : scored)
    .slice(0, 12)
    .map((s) => ({
      title: s.a.title,
      slug: s.a.slug,
      category: s.a.category,
      summary: s.a.summary || "",
      snippet: stripHtml(s.a.content || "").slice(0, 500),
    }));

  const system = `Eres Tarot, el Gran Guardian y Verificador de Coherencia de Lore de Dragopedia / Caldo de Dragon.
Tu tarea es auditar un borrador de articulo para detectar CONTRADICCIONES, ANOMALIAS O INCONSISTENCIAS frente a los articulos existentes de la enciclopedia.
Tipos: "date" (fechas, eras, anos), "relation" (parentescos, linajes, alianzas), "event" (acontecimientos, batallas, tratados), "status" (estado vital), "location" (ciudad, templo o reino en lugar equivocado), "lore_rule" (violar reglas sagradas del lore).
Si no hay inconsistencias reales, devuelve "issues" vacio. No inventes errores si el texto es compatible. Se riguroso y constructivo. Responde en castellano.
Responde UNICAMENTE con un objeto JSON valido, sin texto adicional ni bloques de codigo.`;

  const prompt = `Analiza este texto frente a los tomos de la enciclopedia.

ARTICULO A AUDITAR:
- Titulo: "${title || "Borrador"}"
- Categoria: "${category || "General"}"
- Resumen: "${summary || ""}"
- Contenido: """${clean.slice(0, 4000)}"""

TOMOS RELACIONADOS:
${JSON.stringify(picked)}

Devuelve exactamente este formato:
{"issues":[{"type":"date|relation|event|status|location|lore_rule","severity":"warning|error|notice","description":"explicacion clara","conflictingArticleTitle":"titulo","conflictingArticleSlug":"slug","suggestion":"propuesta para resolverlo"}]}`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ]);
  if (!r) throw new Error("Todos los proveedores de IA fallaron");

  const out: string = r.choices?.[0]?.message?.content || "";
  let issues: unknown[] = [];
  const s = out.indexOf("{");
  const e = out.lastIndexOf("}");
  if (s >= 0 && e > s) {
    try {
      const parsed = JSON.parse(out.slice(s, e + 1));
      if (Array.isArray(parsed.issues)) issues = parsed.issues;
    } catch {}
  }
  return { issues, checkedAgainstCount: picked.length };
}
async function staticJson(env: Env, request: Request, path: string, fallback: unknown): Promise<Response> {
  const res = await env.ASSETS.fetch(new Request(new URL(path, request.url)));
  if (res.ok) {
    const body = await res.text();
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
    });
  }
  return jsonResponse(fallback);
}

function collectKeys(env: Env, base: string): string[] {
  const names = [base];
  for (let i = 1; i <= 10; i++) names.push(base + "_" + i);
  const keys: string[] = [];
  for (const n of names) {
    const v = env[n];
    if (typeof v === "string" && v.trim()) keys.push(v.trim());
  }
  const csv = env[base + "S"];
  if (typeof csv === "string") {
    keys.push(...csv.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return keys;
}
const PROVIDERS = [
  { name: "groq", base: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions", models: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"] },
  { name: "cerebras", base: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions", models: ["gpt-oss-120b", "zai-glm-4.7", "llama3.1-8b"] },
  { name: "mistral", base: "MISTRAL_API_KEY", url: "https://api.mistral.ai/v1/chat/completions", models: ["mistral-small-latest", "open-mistral-nemo"] },
];

let lastAttempts: string[] = [];

async function generate(env: Env, messages: unknown[], extra: Record<string, unknown> = {}) {
  lastAttempts = [];
  for (const p of PROVIDERS) {
    const keys = collectKeys(env, p.base).sort(() => Math.random() - 0.5);
    if (!keys.length) lastAttempts.push(`${p.name}: sin claves`);
    for (let i = 0; i < keys.length; i++) {
      for (const model of p.models) {
        try {
          const res = await fetch(p.url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys[i]}` },
            body: JSON.stringify({ model, messages, ...extra }),
          });
          if (res.ok) {
            const data = (await res.json()) as Record<string, unknown>;
            return { provider: p.name, ...data };
          }
          const txt = (await res.text()).slice(0, 200);
          lastAttempts.push(`${p.name} #${i + 1} ${model}: HTTP ${res.status} ${txt}`);
          if (res.status !== 404) break; // 404 = modelo no disponible: probar el siguiente modelo
        } catch (err: any) {
          lastAttempts.push(`${p.name} #${i + 1} ${model}: ${err?.message || err}`);
          break;
        }
      }
    }
  }
  return null;
}export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "86400" },
      });
    }

    if (url.pathname.startsWith("/api/")) {
      const cleanPath = url.pathname.replace(/\/$/, "");

      if (cleanPath === "/api/tarot/check-consistency" && request.method === "POST") {
      try {
        const body = await request.json();
        return jsonResponse(await tarotCheck(env, request, body));
      } catch (e: any) {
        return jsonResponse({ error: e?.message || "Error al verificar coherencia de lore." }, 500);
      }
    }

    if (cleanPath === "/api/ai/status") {
        return jsonResponse({
          groq: collectKeys(env, "GROQ_API_KEY").length,
          cerebras: collectKeys(env, "CEREBRAS_API_KEY").length,
          mistral: collectKeys(env, "MISTRAL_API_KEY").length,
        });
      }

      if (cleanPath === "/api/ai/generate" && request.method === "POST") {
        const body = (await request.json().catch(() => null)) as { messages?: unknown[] } | null;
        if (!body || !Array.isArray(body.messages)) {
          return jsonResponse({ error: "Falta el campo 'messages'" }, 400);
        }
        const result = await generate(env, body.messages);
        return result ? jsonResponse(result) : jsonResponse({ error: "Todos los proveedores fallaron", attempts: lastAttempts }, 502);
      }

      if (cleanPath === "/api/articles") {
        if (request.method === "GET") {
          const res = await env.ASSETS.fetch(new Request(new URL("/data/articles.json", request.url)));
          if (res.ok) return res;
          return jsonResponse([]);
        }
        try {
          const body = await request.json().catch(() => ({}));
          return jsonResponse({ success: true, article: body });
        } catch {
          return jsonResponse({ success: true, message: "Artículo procesado con éxito" });
        }
      }

      if (cleanPath === "/api/articles/sync") {
        return jsonResponse({
          updates: [],
          deletedIds: [],
          timestamp: new Date().toISOString(),
          message: "All articles in sync with edge",
        });
      }

      const articleMatch = cleanPath.match(/^\/api\/articles\/([^/]+)$/);
      if (articleMatch) {
        const targetSlug = decodeURIComponent(articleMatch[1]).toLowerCase();
        if (request.method === "GET") {
          const res = await env.ASSETS.fetch(new Request(new URL("/data/articles.json", request.url)));
          if (res.ok) {
            const list = ((await res.json().catch(() => [])) as any[]) || [];
            const found = list.find(
              (a) =>
                (a.slug && a.slug.toLowerCase() === targetSlug) ||
                (a.id && a.id.toLowerCase() === targetSlug) ||
                (a.title && a.title.toLowerCase() === targetSlug)
            );
            if (found) return jsonResponse(found);
          }
          return jsonResponse({ error: "Artículo no encontrado" }, 404);
        }
        try {
          const body = await request.json().catch(() => ({}));
          return jsonResponse({ success: true, article: body });
        } catch {
          return jsonResponse({ success: true });
        }
      }

      if (cleanPath === "/api/campaign-events") {
        if (request.method === "GET") {
          const res = await env.ASSETS.fetch(new Request(new URL("/data/campaign_events.json", request.url)));
          if (res.ok) {
            const raw: any = await res.json().catch(() => []);
            const events = Array.isArray(raw) ? raw : raw?.events || [];
            return jsonResponse({ events, count: events.length });
          }
          return jsonResponse({ events: [], count: 0 });
        }
        return jsonResponse({ success: true });
      }

      if (cleanPath === "/api/timeline") {
        if (request.method === "GET") {
          const res = await env.ASSETS.fetch(new Request(new URL("/data/timeline_markers.json", request.url)));
          if (res.ok) {
            const raw: any = await res.json().catch(() => []);
            const markers = Array.isArray(raw) ? raw : raw?.markers || [];
            return jsonResponse({ markers });
          }
          return jsonResponse({ markers: [] });
        }
        return jsonResponse({ success: true });
      }

      if (cleanPath === "/api/site-ui-config") {
        if (request.method === "GET") return staticJson(env, request, "/data/site_ui_config.json", {});
        return jsonResponse({ success: true });
      }
      if (cleanPath === "/api/filter-categories") {
        return staticJson(env, request, "/data/filter_categories.json", {
          campaña: [],
          continente: [],
          plano: [],
          criatura: [],
        });
      }
      if (cleanPath === "/api/categories") {
        return staticJson(env, request, "/data/categories.json", []);
      }
      if (cleanPath === "/api/cartocraft/maps" || cleanPath === "/api/maps") {
        return staticJson(env, request, "/data/maps.json", { maps: [] });
      }
      if (cleanPath === "/api/genealogy") {
        return staticJson(env, request, "/data/genealogy_tree.json", { nodes: [], links: [] });
      }
      if (cleanPath === "/api/spells" || cleanPath === "/api/spellbook") {
        return staticJson(env, request, "/data/spells.json", []);
      }

      if (cleanPath === "/api/bot/status") {
        return jsonResponse({
          active: false,
          botRunning: false,
          message: "Discord bot runs on standalone instance",
          inviteUrl: null,
        });
      }

      if (
        env.BACKEND_URL &&
        !env.BACKEND_URL.includes("ais-dev-") &&
        !env.BACKEND_URL.includes("europe-west2.run.app")
      ) {
        try {
          const targetUrl = new URL(url.pathname + url.search, env.BACKEND_URL);
          const reqHeaders = new Headers(request.headers);
          reqHeaders.set("Host", targetUrl.host);
          const response = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: reqHeaders,
            body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
            redirect: "follow",
          });
          const contentType = response.headers.get("content-type") || "";
          if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
            return jsonResponse({ error: "Backend returned invalid non-JSON format", path: url.pathname }, 502);
          }
          const resHeaders = new Headers(response.headers);
          Object.entries(CORS_HEADERS).forEach(([k, v]) => resHeaders.set(k, v));
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: resHeaders,
          });
        } catch (proxyErr: any) {
          console.error("[Proxy Error]:", proxyErr);
          return jsonResponse({ error: "Backend proxy unreachable", message: proxyErr.message }, 502);
        }
      }

      return jsonResponse({ status: "ok", message: "Endpoint handled by edge worker", path: url.pathname });
    }

    return env.ASSETS.fetch(request);
  },
};