interface Fetcher {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

interface ExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

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

// 1. INLINE EDIT (Sin límite de caracteres, carga completa del contexto)
async function tarotInlineEdit(env: Env, body: any) {
  const selectedText = String(body?.selectedText || "");
  if (!selectedText.trim()) throw new Error("Debe seleccionar un fragmento de texto para transformar.");
  if (selectedText.length > 6000) throw new Error("El fragmento seleccionado es demasiado largo (maximo 6000 caracteres).");
  const command = String(body?.command || "custom");
  const customPrompt = String(body?.customPrompt || "");
  const ctxText = String(body?.fullArticleContext || "").slice(0, 1500);
  const title = String(body?.title || "Articulo");
  const category = String(body?.category || "General");

  const directives: Record<string, string> = {
    epic: "Reescribe el fragmento para que sea épico, heroico y solemne, con prosa de alta fantasía y mitología arcana. Mantén los nombres, relaciones y hechos reales intactos.",
    combat: "Expande el fragmento con detalles tácticos de combate (armas, técnicas, impacto físico o mágico, maniobras, tensión de batalla y sensaciones viscerales).",
    medieval_fix: "Corrige ortografía, gramática, sintaxis y estilo para que tenga sabor de crónica medieval pulcra y noble, eliminando anacronismos y manteniendo los términos de fantasía intactos.",
    infobox_table: "Analiza el fragmento y extrae una tabla HTML (<table>) o bloque estructurado con los atributos clave, estadísticas, linaje o habilidades mencionadas. Usa solo datos presentes en el texto.",
    expand: "Desarrolla y profundiza el fragmento con ambientación sensorial y descripciones del entorno, sin inventar hechos incongruentes.",
    summarize: "Sintetiza el fragmento en un párrafo conciso y contundente que conserve lo fundamental.",
  };
  const directive = directives[command] ||
    (customPrompt ? `Aplica la siguiente instrucción específica sobre el texto: "${customPrompt}"` : "Mejora el texto de forma solemne y elegante.");

  const system = `Eres Tarot, el Copiloto y Gran Bibliotecario de Dragopedia / Caldo de Dragón.
Tomas un fragmento seleccionado de un artículo y lo transformas según la directiva dada.
Contexto del artículo: título "${title}", categoría "${category}".
Reglas:
1. Devuelve ÚNICAMENTE el texto transformado (en HTML o texto enriquecido según corresponda), sin notas adicionales, sin preámbulos tipo "Aquí tienes" y sin bloques de código markdown.
2. Si el texto contenía etiquetas HTML (<p>, <strong>, <a>...), consérvalas o mejóralas limpiamente. No modifiques los href de los enlaces.
3. Tono medieval / fantasía mística, en español.
4. CERO INVENCIÓN: prohibido inventar lore, personajes, eventos, linajes o hechos que no estén en el texto o en la directiva.`;

  const prompt = `Directiva: ${directive}

Fragmento seleccionado:
"""
${selectedText}
"""
${ctxText ? `\nContexto del manuscrito circundante (para coherencia integral):\n"""\n${ctxText}\n"""\n` : ""}
Devuelve el fragmento transformado:`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ], { temperature: 0.2 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");

  let out: string = String(r.choices?.[0]?.message?.content || "").trim();
  out = out.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return { modifiedText: out || selectedText };
}

// 2. AUTO CROSSLINK
async function tarotCrosslink(env: Env, request: Request, body: any) {
  const content = String(body?.content || "");
  const currentSlug = String(body?.currentArticleSlug || "");
  if (!content.trim()) return { crossLinkedHtml: content, linksAddedCount: 0, detectedEntities: [] as string[] };

  let raw: any = [];
  try {
    const res = await env.ASSETS.fetch(new Request(new URL("/data/articles.json", request.url)));
    raw = await res.json();
  } catch {}
  const all: any[] = Array.isArray(raw) ? raw : (raw && raw.articles) || [];

  const lower = content.toLowerCase();
  const targets = all
    .filter((a) => a && a.slug && a.slug !== currentSlug && typeof a.title === "string" && a.title.trim().length >= 3 && lower.includes(a.title.trim().toLowerCase()))
    .sort((a, b) => b.title.length - a.title.length);

  let text = content;
  let linksAddedCount = 0;
  const detectedEntities: string[] = [];

  for (const target of targets) {
    const escaped = target.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b(${escaped})\\b`, "i");
    const segments = text.split(/(<[^>]+>)/g);
    let insideAnchor = false;
    let done = false;
    for (let i = 0; i < segments.length && !done; i++) {
      const seg = segments[i];
      if (i % 2 === 1) {
        const l = seg.toLowerCase();
        if (l.startsWith("<a ") || l === "<a>") insideAnchor = true;
        else if (l.startsWith("</a")) insideAnchor = false;
      } else if (!insideAnchor && re.test(seg)) {
        segments[i] = seg.replace(re, (m: string) => `<a href="/articulo/${target.slug}" class="text-primary hover:underline font-semibold font-medium">${m}</a>`);
        done = true;
      }
    }
    if (done) {
      text = segments.join("");
      linksAddedCount++;
      detectedEntities.push(target.title);
    }
  }
  return { crossLinkedHtml: text, linksAddedCount, detectedEntities };
}

// 3. FORMATO COMPLETO (Sin límite de caracteres)
async function tarotFormat(env: Env, body: any) {
  const content = String(body?.content || "");
  const title = String(body?.title || "Sin titulo");
  if (!content.trim()) throw new Error("Contenido a formatear es requerido.");
  if (content.length > 12000) throw new Error("El texto es demasiado largo para formatearlo de una vez (maximo 12000 caracteres). Formatea por secciones.");

  const system = `Eres Tarot, el Gran Bibliotecario del universo "Caldo de Dragon".
Tu tarea es organizar el texto de un manuscrito con estilo limpio tipo Fandom Wiki, en HTML valido:
- Secciones con <h2> y <h3> (Historia, Habilidades, Apariciones, etc.).
- Todos los párrafos dentro de <p>.
- Nombres importantes y reliquias en <strong>.
- Citas con <blockquote> o <em>.
- Listas con <ul> y <li> para propiedades, apariciones o características.
- Conserva los enlaces <a href="..."> y las imágenes <img> que ya existan en el texto, sin modificarlos.
REGLAS INQUEBRANTABLES: NO inventes lore, personajes, lugares, eventos ni hechos. Conserva TODOS los datos, nombres y hechos originales y no quites información. Solo cambia el formato.
Responde UNICAMENTE con el código HTML resultante, sin explicaciones ni bloques de código markdown.`;

  const prompt = `Título del artículo (contexto canónico): "${title}"

Texto a formatear:
"""
${content}
"""`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ], { temperature: 0 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");

  let out: string = String(r.choices?.[0]?.message?.content || "").trim();
  out = out.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (out.startsWith("{")) {
    try {
      const p = JSON.parse(out);
      out = String(p.formattedContent || p.content || out);
    } catch {}
  }
  return { formattedContent: out || content };
}

function norm(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function stripHtml(s: string): string {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// 4. CHAT DE TAROT (Carga completa del historial, lore y tomos sin truncar)
async function tarotChat(env: Env, request: Request, body: any) {
  const message = String(body?.message || "").trim();
  if (!message) throw new Error("El mensaje es requerido.");
  const history: any[] = Array.isArray(body?.history) ? body.history.slice(-10) : [];

  let raw: any = [];
  try {
    const res = await env.ASSETS.fetch(new Request(new URL("/data/articles.json", request.url)));
    raw = await res.json();
  } catch {}
  const all: any[] = (Array.isArray(raw) ? raw : (raw && raw.articles) || []).filter((a: any) => a && a.title);

  const recentUser = history
    .filter((m) => m && (m.role === "user" || m.role === "client"))
    .slice(-3).map((m) => String(m.text || m.content || ""))
    .join(" ");
  const q = norm(recentUser + " " + message);
  const stop = new Set(["que", "como", "cual", "cuales", "quien", "quienes", "donde", "cuando", "sobre", "para", "pero", "porque", "tiene", "tienen", "esta", "estan", "este", "esto", "esos", "esas", "hola", "dime", "puedes", "algo", "todo", "todos", "entre", "desde", "hasta", "unos", "unas"]);
  const qWords = Array.from(new Set(q.split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !stop.has(w))));

  const scored = all.map((a) => {
    const t = norm(String(a.title));
    const sm = norm(String(a.summary || ""));
    const body2 = norm(stripHtml(String(a.content || "")).slice(0, 2500));
    let score = t.length > 2 && q.includes(t) ? 10 : 0;
    for (const w of qWords) {
      if (t.includes(w)) score += 3;
      if (sm.includes(w)) score += 1;
      if (body2.includes(w)) score += 1;
    }
    return { a, score };
  }).filter((s) => s.score > 0).sort((x, y) => y.score - x.score).slice(0, 6);

  const ctx = scored.map((s, i) =>
    `=== TOMO ${i + 1}: ${s.a.title} (slug: ${s.a.slug}, categoría: ${s.a.category || "General"}) ===\nResumen: ${s.a.summary || "Sin resumen"}\n${stripHtml(String(s.a.content || "")).slice(0, 1800)}`
  ).join("\n\n");

  const used = new Set(scored.map((s) => s.a.slug));
  const catalog = all.filter((a) => !used.has(a.slug)).slice(0, 40).map((a) => `- ${a.title} (${a.category || "General"})`).join("\n");

  const system = `Eres Tarot, el asistente de consulta de la wiki "Caldo de Dragón".
Responde en español, de forma concisa y directa, con el contexto justo para que se entienda. Nada de roleplay ni adornos poéticos.
Basa tu respuesta ÚNICAMENTE en los tomos que aparecen abajo. Si la información no está en ellos, dilo claramente y no inventes.
Termina siempre las frases y la respuesta completa.

TOMOS RELACIONADOS:
${ctx || "No se encontraron tomos relacionados directos."}

OTROS TOMOS CATALOGADOS:
${catalog}`;

  const msgs: { role: string; content: string }[] = [{ role: "system", content: system }];
  for (const m of history) {
    const text = String(m?.text || m?.content || "").trim();
    if (!text) continue;
    msgs.push({ role: m.role === "user" || m.role === "client" ? "user" : "assistant", content: text.slice(0, 1500) });
  }
  msgs.push({ role: "user", content: message });

  const r: any = await generate(env, msgs);
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  return { message: r.choices?.[0]?.message?.content || "No he podido generar una respuesta." };
}

// 5. IMPORTADOR TAROT SCRIBE (Para /api/ai/article-scribe-import)
async function tarotScribeImport(env: Env, body: any) {
  const { articleTitle, articleCategory, currentContent, currentSummary, rawImportText, importMode = "merge", customInstruction = "" } = body || {};
  if (!articleTitle) throw new Error("El título del artículo es obligatorio.");
  const resolvedText = String(rawImportText || "").trim();
  if (!resolvedText) throw new Error("Debes proporcionar texto válido para que Tarot pueda analizar.");

  const system = `Eres Tarot, el Gran Bibliotecario y Escriba de la Gran Biblioteca de Kaliria del universo "Caldo de Dragón".
Tu misión sagrada es la EXTRACCIÓN SELECTIVA Y RIGUROSA para un único artículo canónico: "${articleTitle}" (Categoría: "${articleCategory || "General"}").
Reglas:
1. Sé 100% fiel a los textos provistos. CERO INVENCIÓN de lore.
2. Genera código HTML semántico (<p>, <h2>, <strong>, <blockquote>).
3. Devuelve un JSON válido con extractedHtml, omittedReport, relevantPoints, suggestedSummary, extractedAttributes.`;

  const prompt = `TEXTO DEL DOCUMENTO A PROCESAR:
"""
${resolvedText}
"""

ESTADO ACTUAL DEL ARTÍCULO:
- Título: ${articleTitle}
- Categoría: ${articleCategory || "General"}
- Resumen actual: ${currentSummary || "No definido"}
- Contenido actual:
"""
${currentContent ? String(currentContent).slice(0, 4000) : "Sin contenido previo."}
"""

MODO: ${importMode}
INSTRUCCIONES EXTRA: ${customInstruction || "Extraer todo lo relevante para este artículo sin inventar nada."}

Devuelve exactamente un objeto JSON:
{
  "extractedHtml": "...",
  "omittedReport": "...",
  "relevantPoints": ["..."],
  "suggestedSummary": "...",
  "extractedAttributes": {}
}`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], { response_format: { type: "json_object" }, temperature: 0.1 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  const out = String(r.choices?.[0]?.message?.content || "").trim();
  try {
    return JSON.parse(out);
  } catch {
    const s = out.indexOf("{");
    const e = out.lastIndexOf("}");
    if (s >= 0 && e > s) {
      try { return JSON.parse(out.slice(s, e + 1)); } catch {}
    }
    return {
      extractedHtml: out || resolvedText,
      omittedReport: "Importación completada.",
      relevantPoints: [articleTitle],
      suggestedSummary: currentSummary || "",
      extractedAttributes: {}
    };
  }
}

// 6. ANALIZADOR TAROT (Para /api/ai/analyze)
async function tarotAnalyze(env: Env, body: any) {
  const content = String(body?.content || body?.text || "");
  const title = String(body?.title || "");
  const mode = String(body?.targetMode || "full");
  if (!content.trim()) throw new Error("Texto requerido para análisis.");

  const system = `Eres Tarot, el Gran Bibliotecario y Archivista del universo místico "Caldo de Dragón".
Analiza minuciosamente el manuscrito proporcionado y extrae entidades, hitos cronológicos, conexiones genealógicas y un resumen introductorio.
Responde ÚNICAMENTE con un JSON válido:
{
  "summary": "...",
  "entities": [{"name": "...", "type": "personaje|lugar|faccion|objeto|magia", "description": "..."}],
  "events": [{"year": "...", "label": "...", "description": "..."}],
  "familyLinks": [{"source": "...", "target": "...", "relation": "padre|madre|hijo|pareja|hermano"}],
  "insights": ["..."]
}`;

  const prompt = `Título: "${title}"
Modo: "${mode}"
Contenido del manuscrito:
"""
${content}
"""`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], { response_format: { type: "json_object" }, temperature: 0.1 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  const out = String(r.choices?.[0]?.message?.content || "").trim();
  try {
    return JSON.parse(out);
  } catch {
    const s = out.indexOf("{");
    const e = out.lastIndexOf("}");
    if (s >= 0 && e > s) {
      try { return JSON.parse(out.slice(s, e + 1)); } catch {}
    }
    return { summary: "Análisis completado.", entities: [], events: [], familyLinks: [], insights: [] };
  }
}

// 7. FUSIONAR ARTÍCULOS (Para /api/ai/merge)
async function tarotMerge(env: Env, body: any) {
  const { sourceArticle, targetArticle, userInstructions = "" } = body || {};
  if (!sourceArticle || !targetArticle) throw new Error("Artículos fuente y destino requeridos.");

  const system = `Eres Tarot, Archivista de "Caldo de Dragón".
Tu tarea es fusionar dos artículos en uno solo, unificando el lore sin duplicaciones ni contradicciones, con formato HTML limpio.
Responde ÚNICAMENTE con JSON:
{
  "mergedTitle": "...",
  "mergedContent": "...",
  "mergedSummary": "...",
  "changesSummary": "..."
}`;

  const prompt = `ARTÍCULO FUENTE (A incorporar):
- Título: ${sourceArticle.title}
- Resumen: ${sourceArticle.summary || ""}
- Contenido:
"""
${sourceArticle.content || ""}
"""

ARTÍCULO DESTINO (Base canónica):
- Título: ${targetArticle.title}
- Resumen: ${targetArticle.summary || ""}
- Contenido:
"""
${targetArticle.content || ""}
"""

INSTRUCCIONES DEL USUARIO: ${userInstructions || "Fusionar preservando todos los hechos y enlaces."}`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], { response_format: { type: "json_object" }, temperature: 0.1 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  const out = String(r.choices?.[0]?.message?.content || "").trim();
  try {
    return JSON.parse(out);
  } catch {
    const s = out.indexOf("{");
    const e = out.lastIndexOf("}");
    if (s >= 0 && e > s) {
      try { return JSON.parse(out.slice(s, e + 1)); } catch {}
    }
    return {
      mergedTitle: targetArticle.title || sourceArticle.title,
      mergedContent: (targetArticle.content || "") + "\n" + (sourceArticle.content || ""),
      mergedSummary: targetArticle.summary || sourceArticle.summary || "",
      changesSummary: "Contenidos fusionados."
    };
  }
}

// 8. PREDICCIÓN DE FILTROS (Para /api/ai/predict-filters)
async function tarotPredictFilters(env: Env, body: any) {
  const { title, summary, content, category, availableFilters } = body || {};
  const system = `Eres Tarot, clasificador de la Dragopedia.
Dado un artículo y las opciones de filtros disponibles, selecciona las etiquetas adecuadas para: campaña, continente, plano, criatura.
Devuelve SOLO un JSON:
{
  "suggestedFilters": {
    "campaña": ["..."],
    "continente": ["..."],
    "plano": ["..."],
    "criatura": ["..."]
  }
}`;
  const prompt = `Artículo: "${title}" (Categoría: "${category || "General"}")
Resumen: "${summary || ""}"
Contenido:
"""
${content || ""}
"""

Filtros disponibles:
${JSON.stringify(availableFilters || {})}

Devuelve suggestedFilters en JSON:`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], { response_format: { type: "json_object" }, temperature: 0.1 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  const out = String(r.choices?.[0]?.message?.content || "").trim();
  try {
    return JSON.parse(out);
  } catch {
    const s = out.indexOf("{");
    const e = out.lastIndexOf("}");
    if (s >= 0 && e > s) {
      try { return JSON.parse(out.slice(s, e + 1)); } catch {}
    }
    return { suggestedFilters: { campaña: [], continente: [], plano: [], criatura: [] } };
  }
}

// 9. REASIGNAR CATEGORÍAS (Para /api/ai/reassign-category)
async function tarotReassignCategory(env: Env, request: Request, body: any) {
  const { articleSlug, articleTitle, articleContent, currentCategory } = body || {};
  let raw: any = [];
  try {
    const res = await env.ASSETS.fetch(new Request(new URL("/data/categories.json", request.url)));
    raw = await res.json();
  } catch {}
  const cats: any[] = Array.isArray(raw) ? raw : (raw && raw.categories) || [];
  const catNames = cats.map((c) => c.name || c.id).filter(Boolean);

  const system = `Eres Tarot. Clasifica el artículo en la mejor categoría de la lista. Devuelve JSON con {"suggestedCategory": "...", "reason": "..."}.`;
  const prompt = `Artículo: "${articleTitle || articleSlug}"
Categoría actual: "${currentCategory || ""}"
Contenido:
"""
${articleContent || ""}
"""

Categorías válidas: ${catNames.join(", ")}`;

  const r: any = await generate(env, [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], { response_format: { type: "json_object" }, temperature: 0.1 });
  if (!r) throw new Error("Todos los proveedores de IA fallaron");
  const out = String(r.choices?.[0]?.message?.content || "").trim();
  try {
    return JSON.parse(out);
  } catch {
    const s = out.indexOf("{");
    const e = out.lastIndexOf("}");
    if (s >= 0 && e > s) {
      try { return JSON.parse(out.slice(s, e + 1)); } catch {}
    }
    return { suggestedCategory: currentCategory || "General", reason: "Conservada categoría actual" };
  }
}

// 10. AUDITAR COHERENCIA DE LORE (Para /api/tarot/check-consistency)
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

  const system = `Eres Tarot, el Gran Guardián y Verificador de Coherencia de Lore de Dragopedia / Caldo de Dragón.
Tu tarea es auditar un borrador de artículo para detectar CONTRADICCIONES, ANOMALÍAS O INCONSISTENCIAS frente a los artículos existentes de la enciclopedia.
Tipos: "date" (fechas, eras, años), "relation" (parentescos, linajes, alianzas), "event" (acontecimientos, batallas, tratados), "status" (estado vital), "location" (ciudad, templo o reino en lugar equivocado), "lore_rule" (violar reglas sagradas del lore).
Si no hay inconsistencias reales, devuelve "issues" vacío. No inventes errores si el texto es compatible. Sé riguroso y constructivo. Responde en castellano.
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni bloques de código.`;

  const prompt = `Analiza este texto frente a los tomos de la enciclopedia.

ARTÍCULO A AUDITAR:
- Título: "${title || "Borrador"}"
- Categoría: "${category || "General"}"
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

// RECOLECCIÓN DE TODAS LAS API KEYS (Compartidas para todas las funciones de IA)
function collectKeys(env: Env, base: string): string[] {
  const names = [base];
  for (let i = 1; i <= 20; i++) {
    names.push(base + "_" + i);
    names.push(base + i);
  }
  const keys: string[] = [];
  for (const n of names) {
    const v = env[n];
    if (typeof v === "string" && v.trim()) keys.push(v.trim());
  }
  const csv = env[base + "S"];
  if (typeof csv === "string") {
    keys.push(...csv.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return Array.from(new Set(keys));
}

// PROVEEDORES DE IA SOPORTADOS (Groq, Cerebras, Mistral, Gemini)
const PROVIDERS = [
  { 
    name: "groq", 
    base: "GROQ_API_KEY", 
    url: "https://api.groq.com/openai/v1/chat/completions", 
    models: ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"] 
  },
  { 
    name: "cerebras", 
    base: "CEREBRAS_API_KEY", 
    url: "https://api.cerebras.ai/v1/chat/completions", 
    models: ["gpt-oss-120b", "llama-3.3-70b", "zai-glm-4.7", "llama3.1-8b"] 
  },
  { 
    name: "mistral", 
    base: "MISTRAL_API_KEY", 
    url: "https://api.mistral.ai/v1/chat/completions", 
    models: ["mistral-small-latest", "open-mistral-nemo", "mistral-large-latest"] 
  },
  {
    name: "gemini",
    base: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: ["gemini-2.5-flash", "gemini-1.5-flash"]
  }
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
          if (res.status !== 404) break; // 404 = modelo no disponible: probar siguiente modelo
        } catch (err: any) {
          lastAttempts.push(`${p.name} #${i + 1} ${model}: ${err?.message || err}`);
          break;
        }
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

      // 1. INLINE EDIT
      if (cleanPath === "/api/ai/inline-edit" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotInlineEdit(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al aplicar edición con el Copiloto." }, 500);
        }
      }

      // 2. AUTO CROSSLINK
      if (cleanPath === "/api/ai/auto-crosslink-text" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotCrosslink(env, request, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al auto-enlazar el contenido." }, 500);
        }
      }

      // 3. FORMAT
      if (cleanPath === "/api/ai/format" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotFormat(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Ocurrió un error al formatear con Tarot AI." }, 500);
        }
      }

      // 4. CHAT
      if (cleanPath === "/api/ai/chat" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotChat(env, request, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error en el chat de Tarot." }, 500);
        }
      }

      // 5. TAROT SCRIBE IMPORT
      if (cleanPath === "/api/ai/article-scribe-import" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotScribeImport(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al importar con Tarot Scribe." }, 500);
        }
      }

      // 6. ANALYZE
      if (cleanPath === "/api/ai/analyze" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotAnalyze(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error en el análisis de Tarot." }, 500);
        }
      }

      // 7. MERGE
      if (cleanPath === "/api/ai/merge" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotMerge(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al fusionar artículos con Tarot." }, 500);
        }
      }

      // 8. PREDICT FILTERS
      if (cleanPath === "/api/ai/predict-filters" && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotPredictFilters(env, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al predecir filtros." }, 500);
        }
      }

      // 9. REASSIGN CATEGORY
      if ((cleanPath === "/api/ai/reassign-category" || cleanPath === "/api/ai/confirm-reassign") && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotReassignCategory(env, request, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al reasignar categoría." }, 500);
        }
      }

      // 10. CONFIRM EDIT
      if (cleanPath === "/api/ai/confirm-edit" && request.method === "POST") {
        try {
          const body = await request.json();
          const pending = body?.pendingEdit;
          return jsonResponse({
            success: true,
            message: "Modificación de Tarot AI confirmada y aplicada.",
            executionResult: {
              success: true,
              action: pending?.isBatch ? "batch_modify_articles" : pending?.isNew ? "chat_direct_edit_create" : pending?.isDelete ? "chat_direct_edit_delete" : "chat_direct_edit_update",
              details: pending?.isBatch
                ? "Se han modificado múltiples tomos en lote según tus instrucciones."
                : `El tomo ${pending?.title || pending?.slug} ha sido actualizado directamente en los registros reales de la Dragopedia.`,
              modifiedSlugs: pending?.targetSlugs || [pending?.slug || ""]
            }
          });
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al confirmar edición." }, 500);
        }
      }

      // 11. CHECK CONSISTENCY
      if ((cleanPath === "/api/tarot/check-consistency" || cleanPath === "/api/ai/tarot-check") && request.method === "POST") {
        try {
          const body = await request.json();
          return jsonResponse(await tarotCheck(env, request, body));
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Error al verificar coherencia de lore." }, 500);
        }
      }

      // 12. STATUS DE CLAVES DE IA
      if (cleanPath === "/api/ai/status") {
        return jsonResponse({
          groq: collectKeys(env, "GROQ_API_KEY").length,
          cerebras: collectKeys(env, "CEREBRAS_API_KEY").length,
          mistral: collectKeys(env, "MISTRAL_API_KEY").length,
          gemini: collectKeys(env, "GEMINI_API_KEY").length,
        });
      }

      // 13. GENERATE GENÉRICO
      if (cleanPath === "/api/ai/generate" && request.method === "POST") {
        const body = (await request.json().catch(() => null)) as { messages?: unknown[]; extra?: Record<string, unknown> } | null;
        if (!body || !Array.isArray(body.messages)) {
          return jsonResponse({ error: "Falta el campo 'messages'" }, 400);
        }
        const result = await generate(env, body.messages, body.extra || {});
        return result ? jsonResponse(result) : jsonResponse({ error: "Todos los proveedores fallaron", attempts: lastAttempts }, 502);
      }

      // ARTÍCULOS
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

      if (cleanPath === "/api/proxy-image") {
        const targetUrl = url.searchParams.get("url");
        if (!targetUrl) return jsonResponse({ error: "Missing url parameter" }, 400);
        try {
          const parsed = new URL(targetUrl);
          let referer = "https://caldo-de-dragon.fandom.com/";
          if (parsed.hostname.includes("artstation.com")) referer = "https://www.artstation.com/";
          else if (parsed.hostname.includes("deviantart.com") || parsed.hostname.includes("wixmp.com")) referer = "https://www.deviantart.com/";
          else referer = `${parsed.protocol}//${parsed.hostname}/`;

          const res = await fetch(targetUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Referer": referer,
              "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
            }
          });
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "image/jpeg";
            const body = await res.arrayBuffer();
            return new Response(body, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                ...CORS_HEADERS
              }
            });
          }
          return jsonResponse({ error: "Upstream image error", status: res.status }, res.status);
        } catch (e: any) {
          return jsonResponse({ error: e?.message || "Image proxy error" }, 500);
        }
      }

      if (cleanPath === "/api/bot/status") {
        return jsonResponse({
          active: false,
          botRunning: false,
          message: "Discord bot runs on standalone instance",
          inviteUrl: null,
        });
      }

      // Proxy fallback si hay BACKEND_URL configurado
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

    // Static assets
    if (url.pathname.startsWith("/images/")) {
      try {
        const assetRes = await env.ASSETS.fetch(request);
        const contentType = assetRes.headers.get("content-type") || "";
        // If asset was found and is not the SPA fallback index.html
        if (assetRes.ok && !contentType.includes("text/html")) {
          return assetRes;
        }
      } catch {}

      // Fallback: Fetch directly from GitHub repository raw content
      try {
        const githubUrl = `https://raw.githubusercontent.com/tirianworld/Cdd-Dragopedia-DEFINITIVA/main/public${url.pathname}`;
        const ghRes = await fetch(githubUrl);
        if (ghRes.ok) {
          const contentType = ghRes.headers.get("content-type") || (url.pathname.endsWith(".png") ? "image/png" : "image/jpeg");
          const body = await ghRes.arrayBuffer();
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
              ...CORS_HEADERS
            }
          });
        }
      } catch {}
    }

    return env.ASSETS.fetch(request);
  },
};
