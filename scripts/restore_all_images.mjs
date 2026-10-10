import fs from "fs";
import path from "path";

const token = process.env.GITHUB_TOKEN;
const repo = "tirianworld/Cdd-Dragopedia-DEFINITIVA";
const PREV_COMMIT = "de46b03811501618084273f37a2ee7305fcbe48d";

if (!token) {
  console.error("No GITHUB_TOKEN");
  process.exit(1);
}

async function githubRequest(endpoint, method = "GET", body = null) {
  const url = endpoint.startsWith("https://") ? endpoint : `https://api.github.com/repos/${repo}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "Dragopedia-Image-Restore",
    Accept: "application/vnd.github.v3+json",
  };
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub error ${res.status}: ${txt}`);
  }
  return await res.json();
}

async function main() {
  console.log("--> Fetching tree from previous commit:", PREV_COMMIT);
  const prevTree = await githubRequest(`/git/trees/${PREV_COMMIT}?recursive=1`);

  const imageEntries = prevTree.tree.filter((item) => {
    return (
      item.type === "blob" &&
      (item.path.startsWith("public/images/covers/") ||
        item.path.startsWith("public/images/cloud/") ||
        item.path.startsWith("public/images/uploads/"))
    );
  });

  console.log(`Found ${imageEntries.length} image files to restore.`);

  // 1. Download image files to local public/images/
  let downloaded = 0;
  let skipped = 0;

  for (let i = 0; i < imageEntries.length; i++) {
    const item = imageEntries[i];
    const localPath = path.join(process.cwd(), item.path);
    if (fs.existsSync(localPath)) {
      skipped++;
      continue;
    }

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    const rawUrl = `https://raw.githubusercontent.com/${repo}/${PREV_COMMIT}/${item.path}`;
    try {
      const res = await fetch(rawUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(localPath, buffer);
        downloaded++;
        if (downloaded % 50 === 0 || i === imageEntries.length - 1) {
          console.log(`Downloaded ${downloaded}/${imageEntries.length} images... (latest: ${item.path})`);
        }
      } else {
        console.warn(`Failed to fetch ${item.path}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn(`Error fetching ${item.path}:`, e.message);
    }
  }

  console.log(`Local download complete! Downloaded: ${downloaded}, already existed: ${skipped}`);

  // 2. Restore images on GitHub tree
  console.log("--> Restoring images on GitHub branch main...");
  const currentRef = await githubRequest("/git/ref/heads/main");
  const parentCommitSha = currentRef.object.sha;

  // Prepare tree entries directly referencing existing git blob SHAs!
  const treeEntries = imageEntries.map((item) => ({
    path: item.path,
    mode: "100644",
    type: "blob",
    sha: item.sha,
  }));

  console.log(`Sending ${treeEntries.length} image entries to GitHub tree with base_tree ${parentCommitSha}...`);
  const newTree = await githubRequest("/git/trees", "POST", {
    base_tree: parentCommitSha,
    tree: treeEntries,
  });
  console.log("New tree SHA:", newTree.sha);

  console.log("--> Creating commit...");
  const commit = await githubRequest("/git/commits", "POST", {
    message: "fix(images): restore all article covers and cloud images from previous release",
    tree: newTree.sha,
    parents: [parentCommitSha],
  });
  console.log("New commit SHA:", commit.sha);

  console.log("--> Updating refs/heads/main...");
  await githubRequest("/git/refs/heads/main", "PATCH", {
    sha: commit.sha,
    force: false,
  });

  console.log(`✓ ALL IMAGES FULLY RESTORED on GitHub and locally! Commit: ${commit.sha}`);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
