import fs from "fs";
import path from "path";
import crypto from "crypto";

const token = process.env.GITHUB_TOKEN;
const repo = "tirianworld/Cdd-Dragopedia-DEFINITIVA";

if (!token) {
  console.error("No GITHUB_TOKEN provided.");
  process.exit(1);
}

function gitBlobSha(buf) {
  const header = `blob ${buf.length}\0`;
  return crypto.createHash("sha1").update(header).update(buf).digest("hex");
}

async function githubRequest(endpoint, method = "GET", body = null, retries = 3) {
  const url = endpoint.startsWith("https://") ? endpoint : `https://api.github.com/repos/${repo}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "Dragopedia-Push-Script",
    Accept: "application/vnd.github.v3+json",
  };
  if (body) headers["Content-Type"] = "application/json";

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 502 || res.status === 503 || res.status === 504) {
        console.warn(`[GitHub ${res.status}] Retrying ${endpoint} (${attempt}/${retries})...`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }

      const txt = await res.text();
      throw new Error(`GitHub API error ${res.status} on ${endpoint}: ${txt}`);
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

async function uploadBlob(buf) {
  const content = buf.toString("base64");
  const data = await githubRequest("/git/blobs", "POST", {
    content,
    encoding: "base64",
  });
  return data.sha;
}

const IGNORED_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".env",
  ".dev.env.json",
  ".dev.pid",
  "package-lock.json",
  "bun.lock",
  ".DS_Store",
]);

function shouldIgnore(relPath) {
  const parts = relPath.split(path.sep);
  for (const part of parts) {
    if (IGNORED_NAMES.has(part)) return true;
    if (part.endsWith(".log")) return true;
  }
  return false;
}

async function main() {
  console.log("--> Fetching current commit from GitHub main branch...");
  const refData = await githubRequest("/git/ref/heads/main");
  const parentCommitSha = refData.object.sha;
  console.log("Parent commit SHA:", parentCommitSha);

  console.log("--> Fetching remote tree...");
  const remoteTreeData = await githubRequest(`/git/trees/${parentCommitSha}?recursive=1`);
  const remoteMap = new Map();
  remoteTreeData.tree.forEach((f) => {
    if (f.type === "blob") remoteMap.set(f.path, f.sha);
  });
  console.log(`Remote repository currently has ${remoteMap.size} files.`);

  console.log("--> Scanning local files...");
  const localMap = new Map();
  function walk(dir) {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      const rel = path.relative(".", full).replace(/\\/g, "/");
      if (shouldIgnore(rel)) continue;

      if (item.isDirectory()) {
        walk(full);
      } else if (item.isFile()) {
        localMap.set(rel, full);
      }
    }
  }
  walk(".");
  console.log(`Found ${localMap.size} local files.`);

  const deltaTreeEntries = [];
  let changedCount = 0;
  let addedCount = 0;
  let deletedCount = 0;

  // 1. Process local files that are new or changed
  for (const [rel, full] of localMap.entries()) {
    const buf = fs.readFileSync(full);
    const localSha = gitBlobSha(buf);
    const remoteSha = remoteMap.get(rel);

    if (remoteSha !== localSha) {
      console.log(`Uploading/updating: ${rel} (${buf.length} bytes)...`);
      const newSha = await uploadBlob(buf);
      deltaTreeEntries.push({
        path: rel,
        mode: "100644",
        type: "blob",
        sha: newSha,
      });
      if (remoteSha) changedCount++;
      else addedCount++;
    }
  }

  // 2. Process deleted files (files in remoteMap that do not exist locally)
  for (const remotePath of remoteMap.keys()) {
    if (shouldIgnore(remotePath)) continue;
    if (!localMap.has(remotePath)) {
      console.log(`Removing from remote: ${remotePath}`);
      deltaTreeEntries.push({
        path: remotePath,
        mode: "100644",
        type: "blob",
        sha: null,
      });
      deletedCount++;
    }
  }

  console.log(`Deltas ready: ${changedCount} changed, ${addedCount} added, ${deletedCount} deleted.`);

  if (deltaTreeEntries.length === 0) {
    console.log("Repository is already 100% up-to-date! No changes to commit.");
    return;
  }

  console.log("--> Creating Git tree with base_tree on GitHub...");
  const newTreeData = await githubRequest("/git/trees", "POST", {
    base_tree: parentCommitSha,
    tree: deltaTreeEntries,
  });
  console.log("New tree SHA:", newTreeData.sha);

  console.log("--> Creating commit...");
  const commitMessage = "feat(spells): integrate native D&D spellbook and synchronize all wiki updates with Dragopedia";
  const newCommitData = await githubRequest("/git/commits", "POST", {
    message: commitMessage,
    tree: newTreeData.sha,
    parents: [parentCommitSha],
  });
  console.log("New commit SHA:", newCommitData.sha);

  console.log("--> Updating GitHub refs/heads/main to new commit...");
  await githubRequest("/git/refs/heads/main", "PATCH", {
    sha: newCommitData.sha,
    force: false,
  });

  console.log(`✓ SUCCESS! Branch main updated to ${newCommitData.sha}`);
  console.log(`Commit URL: https://github.com/${repo}/commit/${newCommitData.sha}`);
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
