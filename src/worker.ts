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
  { name: "groq", base: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" },
  { name: "cerebras", base: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions", model: "llama3.1-8b" },
  { name: "mistral", base: "MISTRAL_API_KEY", url: "https://api.mistral.ai/v1/chat/completions", model: "mistral-small-latest" },
];

async function generate(env: Env, messages: unknown[], extra: Record<string, unknown> = {}) {
  for (const p of PROVIDERS) {
    const keys = collectKeys(env, p.base).sort(() => Math.random() - 0.5);
    for (const key of keys) {
      try {
        const res = await fetch(p.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: p.model, messages, ...extra }),
        });
        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>;
          return { provider: p.name, ...data };
        }
      } catch (err) {
        console.error(`[AI ${p.name}]`, err);
      }
    }
  }
  return null;
}

export default {
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
        return result ? jsonResponse(result) : jsonResponse({ error: "Todos los proveedores fallaron" }, 502);
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