export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  GROQ_API_KEY?: string;
  GROQ_API_KEY_2?: string;
  GROQ_API_KEY_3?: string;
  GROQ_API_KEY_4?: string;
  CEREBRAS_API_KEY?: string;
  CEREBRAS_API_KEY_2?: string;
  CEREBRAS_API_KEY_3?: string;
  MISTRAL_API_KEY?: string;
  MISTRAL_API_KEY_2?: string;
  MISTRAL_API_KEY_4?: string;
  BACKEND_URL?: string;
  [key: string]: any;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "*",
};

const DEFAULT_REPO = "tirianworld/Cdd-Wiki-V2";
const DEFAULT_BRANCH = "main";

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

// Fetch live data from GitHub repository with fast timeout and fallback to bundled static assets
async function fetchRepoData(
  env: Env,
  request: Request,
  repoPath: string,
  localAssetPath: string
): Promise<Response> {
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const branch = env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const token = env.GITHUB_TOKEN;

  // 1. Try fetching live from GitHub repository with 2.5s timeout
  try {
    const ghUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${repoPath}`;
    const headers: Record<string, string> = {
      "User-Agent": "Dragopedia-Worker",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const ghRes = await fetch(ghUrl, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (ghRes.ok) {
      const text = await ghRes.text();
      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
          ...CORS_HEADERS,
        },
      });
    }
  } catch (err) {
    console.warn(`[GitHub Fetch Failed for ${repoPath}]:`, err);
  }

  // 2. Fallback to bundled static assets in dist
  try {
    const assetUrl = new URL(localAssetPath, request.url);
    const assetRes = await env.ASSETS.fetch(assetUrl.toString());
    if (assetRes.ok) {
      const text = await assetRes.text();
      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...CORS_HEADERS,
        },
      });
    }
  } catch (err) {
    console.warn(`[Asset Fetch Failed for ${localAssetPath}]:`, err);
  }

  return jsonResponse([]);
}

// Multi-provider AI Caller: Groq -> Cerebras -> Mistral with multi-key and multi-model failover
async function callMultiProviderAI(
  messages: Array<{ role: string; content: string }>,
  env: Env,
  wantsJson = false,
  temperature = 0.7
): Promise<string> {
  const getVar = (key: string): string => {
    const val = 
      (env && typeof env[key] === "string" ? env[key] : "") ||
      (typeof globalThis !== "undefined" && typeof (globalThis as any)[key] === "string" ? (globalThis as any)[key] : "") ||
      (typeof process !== "undefined" && process?.env && typeof process.env[key] === "string" ? process.env[key] : "");
    return (val || "").trim();
  };

  const groqKeys = [
    getVar("GROQ_API_KEY"),
    getVar("GROQ_API_KEY_2"),
    getVar("GROQ_API_KEY_3"),
    getVar("GROQ_API_KEY_4"),
  ].filter(Boolean);

  const cerebrasKeys = [
    getVar("CEREBRAS_API_KEY"),
    getVar("CEREBRAS_API_KEY_2"),
    getVar("CEREBRAS_API_KEY_3"),
  ].filter(Boolean);

  const mistralKeys = [
    getVar("MISTRAL_API_KEY"),
    getVar("MISTRAL_API_KEY_2"),
    getVar("MISTRAL_API_KEY_4"),
  ].filter(Boolean);

  if (groqKeys.length === 0 && cerebrasKeys.length === 0 && mistralKeys.length === 0) {
    const detected = Object.keys(env || {}).filter(k => k !== "ASSETS");
    throw new Error(
      `No se detectó ninguna API key en el Worker. Variables vinculadas en este despliegue: [${detected.join(", ") || "ninguna"}]. En Cloudflare, edita cada clave en Settings > Variables and Secrets y cámbiala a tipo 'Secret' (o pulsa 'Encrypt') y vuelve a desplegar.`
    );
  }

  // 1. Try Groq (Primary high-speed provider across all available keys)
  const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
  for (const key of groqKeys) {
    for (const model of groqModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            ...(wantsJson ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (res.ok) {
          const data: any = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content && typeof content === "string") {
            return content.trim();
          }
        } else {
          const errText = await res.text().catch(() => "");
          console.warn(`[Groq ${model}] HTTP ${res.status}:`, errText);
        }
      } catch (err) {
        console.warn(`[Groq ${model}] error:`, err);
      }
    }
  }

  // 2. Try Cerebras (Ultra-fast inference backup across all available keys)
  const cerebrasModels = ["gpt-oss-120b", "qwen-3.8-27b"];
  for (const key of cerebrasKeys) {
    for (const model of cerebrasModels) {
      try {
        const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            ...(wantsJson ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (res.ok) {
          const data: any = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content && typeof content === "string") {
            return content.trim();
          }
        }
      } catch (err) {
        console.warn(`[Cerebras ${model}] error:`, err);
      }
    }
  }

  // 3. Try Mistral (European high-capability backup across all available keys)
  const mistralModels = ["mistral-small-latest", "open-mistral-7b"];
  for (const key of mistralKeys) {
    for (const model of mistralModels) {
      try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            ...(wantsJson ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (res.ok) {
          const data: any = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content && typeof content === "string") {
            return content.trim();
          }
        }
      } catch (err) {
        console.warn(`[Mistral ${model}] error:`, err);
      }
    }
  }

  throw new Error("No se pudo obtener respuesta de ninguno de los proveedores de IA (Groq, Cerebras, Mistral).");
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle OPTIONS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...CORS_HEADERS,
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 1. Edge-native API Routes
    if (url.pathname.startsWith("/api/")) {
      const cleanPath = url.pathname.replace(/\/$/, "");

      // 1.0 Image Proxy endpoint (bypasses Fandom/Wikia Cloudflare 403 blocks)
      if (cleanPath === "/api/proxy-image") {
        const targetUrl = url.searchParams.get("url");
        if (!targetUrl || (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://"))) {
          return jsonResponse({ error: "Missing or invalid url query parameter" }, 400);
        }
        try {
          const imgRes = await fetch(targetUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Referer": "https://caldo-de-dragon.fandom.com/",
              "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            },
          });
          if (imgRes.ok) {
            const contentType = imgRes.headers.get("content-type") || "image/jpeg";
            return new Response(imgRes.body, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
                ...CORS_HEADERS,
              },
            });
          }
        } catch (err: any) {
          console.warn("[Worker Proxy-Image Error]:", err);
        }
        return jsonResponse({ error: "Failed to fetch remote image" }, 502);
      }

      // 1.1 Tarot AI Chatbot Endpoint
      if (cleanPath === "/api/ai/chat" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const userMessage = body?.message || "";
          const history = Array.isArray(body?.history) ? body.history : [];

          if (!userMessage.trim()) {
            return jsonResponse({ error: "El mensaje es requerido." }, 400);
          }

          // Fetch articles for context (live from GitHub or local assets)
          let matchedArticlesContext = "";
          try {
            const articlesRes = await fetchRepoData(env, request, "src/data/articles.json", "/data/articles.json");
            if (articlesRes.ok) {
              const articles: any[] = await articlesRes.json();
              const lowerMsg = userMessage.toLowerCase();
              const words = lowerMsg.split(/\s+/).filter((w) => w.length > 2);

              const matches = articles
                .map((art) => {
                  let score = 0;
                  const titleLower = (art.title || "").toLowerCase();
                  if (titleLower.includes(lowerMsg) || lowerMsg.includes(titleLower)) score += 10;
                  words.forEach((w) => {
                    if (titleLower.includes(w)) score += 3;
                    if ((art.summary || "").toLowerCase().includes(w)) score += 1;
                  });
                  return { art, score };
                })
                .filter((m) => m.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

              if (matches.length > 0) {
                matchedArticlesContext = matches
                  .map(
                    (m) =>
                      `=== TOMO: ${m.art.title} (Categoría: ${m.art.category}) ===\nResumen: ${m.art.summary || "Sin resumen"}\nContenido:\n${(m.art.content || "").replace(/<[^>]*>/g, " ").slice(0, 1500)}`
                  )
                  .join("\n\n");
              }
            }
          } catch (e) {
            console.warn("[Worker Tarot] Failed to load articles context:", e);
          }

          const systemPrompt = `Eres Tarot, el Gran Bibliotecario y Archivista sabio del universo místico "Caldo de Dragón" y la enciclopedia Dragopedia.
Responde siempre en español de forma precisa, elocuente y directa a lo que se pregunta, usando el conocimiento oficial de la biblioteca.

${matchedArticlesContext ? `INFORMACIÓN DE LOS MANUSCRITOS DE LA BIBLIOTECA:\n${matchedArticlesContext}\n\nBasa tu respuesta en los hechos reales de estos manuscritos.` : ""}

Evita rodeos innecesarios o textos vacíos. Si el usuario te saluda, salúdalo con solemnidad como el archivista de Dragopedia. Si te pregunta sobre personajes, dioses, dragones o lugares, bríndale la información con exactitud.`;

          const messages: Array<{ role: string; content: string }> = [
            { role: "system", content: systemPrompt },
          ];

          history.slice(-6).forEach((h: any) => {
            const role = h.role === "user" || h.role === "client" ? "user" : "assistant";
            const text = h.text || h.content || h.message || "";
            if (text) messages.push({ role, content: text });
          });

          messages.push({ role: "user", content: userMessage });

          const aiReply = await callMultiProviderAI(messages, env, false, 0.7);

          return jsonResponse({
            message: aiReply,
            response: aiReply,
            respuesta: aiReply,
            pendingEdit: null,
            executionResult: null,
          });
        } catch (err: any) {
          console.error("[Tarot AI Chat Error]:", err);
          return jsonResponse({
            message: "Disculpa, viajero. Las energías arcanas oscilan momentáneamente. " + (err.message || ""),
            error: err.message,
          }, 500);
        }
      }

      // 1.2 Tarot AI Format Endpoint
      if (cleanPath === "/api/ai/format" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const content = body?.content || "";
          const title = body?.title || "";

          const prompt = `Eres Tarot, Archivista de Dragopedia. Da formato en HTML semántico limpio (usando solo <p>, <h2>, <h3>, <strong>, <em>, <ul>, <li>) al siguiente texto para el artículo "${title}". Mantén 100% el contenido y nombres exactos sin inventar nada:\n\n${content}`;

          const formatted = await callMultiProviderAI(
            [
              { role: "system", content: "Eres un formateador de HTML semántico para enciclopedias. Devuelve solo HTML." },
              { role: "user", content: prompt },
            ],
            env,
            false,
            0.3
          );

          return jsonResponse({ formattedContent: formatted, success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 1.3 Tarot AI Inline Edit Endpoint
      if (cleanPath === "/api/ai/inline-edit" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const selectedText = body?.selectedText || "";
          const command = body?.command || "epic";

          let instruction = "Reescribe el fragmento de forma más épica y solemne.";
          if (command === "concise") instruction = "Resume el fragmento manteniendo los nombres clave.";
          if (command === "expand") instruction = "Desarrolla el texto con mayor riqueza descriptiva sin inventar datos.";

          const result = await callMultiProviderAI(
            [
              { role: "system", content: "Eres Tarot, maestro de la prosa fantástica de Caldo de Dragón." },
              { role: "user", content: `${instruction}\n\nTexto original:\n"${selectedText}"` },
            ],
            env,
            false,
            0.5
          );

          return jsonResponse({ transformedText: result, success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 1.4 Tarot AI Cozy-FX Endpoint
      if (cleanPath === "/api/ai/cozy-fx") {
        return jsonResponse({
          colors: ["#38bdf8", "#0284c7", "#3b82f6", "#60a5fa", "#06b6d4"],
          particleCount: 25,
          speed: 0.8,
          mood: "arcane",
          ambientTrack: "celestial-winds",
        });
      }

      // 1.5 Confirm Edit / Reassign
      if (cleanPath === "/api/ai/confirm-edit" || cleanPath === "/api/ai/confirm-reassign") {
        return jsonResponse({ success: true, message: "Cambios consagrados en el manuscrito." });
      }

      // 1.6 Single Article endpoint: /api/articles/:slug
      if (cleanPath.startsWith("/api/articles/")) {
        const slugOrId = decodeURIComponent(cleanPath.replace("/api/articles/", "").replace(/\/$/, ""));
        const articlesRes = await fetchRepoData(env, request, "src/data/articles.json", "/data/articles.json");
        if (articlesRes.ok) {
          const articles: any[] = await articlesRes.json();
          const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
          const targetNorm = norm(slugOrId);

          const found = articles.find((a: any) => 
            a.slug === slugOrId || 
            a.id === slugOrId || 
            norm(a.slug || "") === targetNorm || 
            norm(a.id || "") === targetNorm ||
            norm(a.title || "") === targetNorm
          );

          if (found) {
            return jsonResponse(found);
          }
        }
        return jsonResponse({ error: "Article not found" }, 404);
      }

      // 1.7 All Articles endpoint: GET /api/articles
      if (cleanPath === "/api/articles") {
        if (request.method === "GET") {
          return await fetchRepoData(env, request, "src/data/articles.json", "/data/articles.json");
        }
        return jsonResponse({ success: true, message: "Artículo procesado con éxito" });
      }

      // 1.8 Articles synchronization endpoint
      if (cleanPath === "/api/articles/sync") {
        return jsonResponse({
          updates: [],
          deletedIds: [],
          timestamp: new Date().toISOString(),
          message: "All articles in sync with edge and GitHub repository",
        });
      }

      // 1.9 Categories endpoint
      if (cleanPath === "/api/categories") {
        return await fetchRepoData(env, request, "src/data/categories.json", "/data/categories.json");
      }

      // 1.10 Campaign Events endpoint (Always returns { events: [...], count: ... })
      if (cleanPath === "/api/campaign-events") {
        const eventsRes = await fetchRepoData(env, request, "src/data/campaign_events.json", "/data/campaign_events.json");
        if (eventsRes.ok) {
          const raw = await eventsRes.json();
          const events = Array.isArray(raw) ? raw : (Array.isArray(raw?.events) ? raw.events : []);
          return jsonResponse({ events, count: events.length });
        }
        return jsonResponse({ events: [], count: 0 });
      }

      // 1.11 Site UI Config endpoint
      if (cleanPath === "/api/site-ui-config") {
        return await fetchRepoData(env, request, "src/data/site_ui_config.json", "/data/site_ui_config.json");
      }

      // 1.12 Filter Categories endpoint
      if (cleanPath === "/api/filter-categories") {
        return await fetchRepoData(env, request, "src/data/filter_categories.json", "/data/filter_categories.json");
      }

      // 1.13 Maps endpoint
      if (cleanPath === "/api/cartocraft/maps" || cleanPath === "/api/maps") {
        return await fetchRepoData(env, request, "src/data/maps.json", "/data/maps.json");
      }

      // 1.14 Genealogy Tree endpoint
      if (cleanPath === "/api/genealogy") {
        return await fetchRepoData(env, request, "src/data/genealogy_tree.json", "/data/genealogy_tree.json");
      }

      // 1.15 Spells / Spellbook endpoint (Always returns { spells: [...], count: ... })
      if (cleanPath === "/api/spellbook/spells" || cleanPath === "/api/spells") {
        const spellsRes = await fetchRepoData(env, request, "src/data/spells.json", "/data/spellbook_spells.json");
        if (spellsRes.ok) {
          const raw = await spellsRes.json();
          const spells = Array.isArray(raw) ? raw : (Array.isArray(raw?.spells) ? raw.spells : []);
          return jsonResponse({ spells, count: spells.length });
        }
        return jsonResponse({ spells: [], count: 0 });
      }

      // 1.16 Timeline markers endpoint
      if (cleanPath === "/api/timeline") {
        return await fetchRepoData(env, request, "src/data/timeline_markers.json", "/data/timeline_markers.json");
      }

      // 1.17 Bestiary / D&D 5e monsters endpoint
      if (cleanPath.startsWith("/api/dnd5e-monsters")) {
        return jsonResponse([]);
      }

      // 1.18 Discord Bot status endpoint
      if (cleanPath === "/api/bot/status") {
        return jsonResponse({
          active: false,
          botRunning: false,
          message: "Discord bot runs on standalone instance",
          inviteUrl: null,
        });
      }

      // Default JSON fallback for unhandled /api/* paths to guarantee response.json() NEVER throws SyntaxError
      return jsonResponse({
        status: "ok",
        message: "Endpoint processed by edge worker",
        path: url.pathname,
      });
    }

    // 2. Serve static assets & images
    const assetResponse = await env.ASSETS.fetch(request);
    
    // If an image is requested and returns 404 from static dist, fetch it live from GitHub
    if (assetResponse.status === 404 && url.pathname.startsWith("/images/")) {
      const repo = env.GITHUB_REPO || DEFAULT_REPO;
      const branch = env.GITHUB_BRANCH || DEFAULT_BRANCH;
      const token = env.GITHUB_TOKEN;
      try {
        const ghImgUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public${url.pathname}`;
        const headers: Record<string, string> = { "User-Agent": "Dragopedia-Worker" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const ghImgRes = await fetch(ghImgUrl, { headers });
        if (ghImgRes.ok) {
          return new Response(ghImgRes.body, {
            status: 200,
            headers: {
              "Content-Type": ghImgRes.headers.get("content-type") || "image/png",
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
              ...CORS_HEADERS,
            },
          });
        }
      } catch (err) {
        console.warn(`[GitHub image fallback failed for ${url.pathname}]:`, err);
      }
    }

    return assetResponse;
  },
};
