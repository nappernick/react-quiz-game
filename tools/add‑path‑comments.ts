#!/usr/bin/env ts-node
/**
 * add‑path‑comments.ts
 *
 * Adds a header comment with the file's relative path (e.g. // src/hooks/useCodingChallenge.ts)
 * to every .ts, .tsx, and .css file under ./src.  Idempotent: skips files that
 * already start with the correct comment.
 *
 * Usage:
 *   npx ts-node tools/add-path-comments.ts         # ts-node
 *   bun run tools/add-path-comments.ts             # bun
 *   tsx tools/add-path-comments.ts                 # esbuild/tsx
 *   tsc --outDir dist tools/add-path-comments.ts && node dist/add-path-comments.js
 */

import { promises as fs } from "fs";
import path from "path";

const SRC_ROOT = path.join(process.cwd(), "src");          // project/src
const TARGET_EXTS = new Set([".ts", ".tsx", ".css"]);      // extensions we care about

/** Walk `dir` depth‑first and return full paths for all files we want to touch */
async function* walk(dir: string): AsyncGenerator<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    // Skip things like node_modules or build artifacts inside src if any
    if (dirent.isDirectory()) {
      if (dirent.name === "node_modules" || dirent.name.startsWith(".")) continue;
      yield* walk(path.join(dir, dirent.name));
    } else if (TARGET_EXTS.has(path.extname(dirent.name))) {
      yield path.join(dir, dirent.name);
    }
  }
}

/** Return the comment string we expect at the very top of this file */
function makeExpectedComment(absPath: string): string {
  const rel = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const ext = path.extname(absPath);
  // css uses /* … */, TS/TSX use //
  if (ext === ".css") return `/* ${rel} */\n`;
  return `// ${rel}\n`;
}

/**
 * Add the path comment to `file` if it’s missing.
 * @returns true if the file was modified.
 */
async function ensurePathComment(file: string): Promise<boolean> {
  const expected = makeExpectedComment(file);
  const buf = await fs.readFile(file, "utf8");

  // Fast check: already correct?
  if (buf.startsWith(expected)) return false;

  // Edge case: the user already added *some* comment on the first line.
  // Only insert if that comment is not the correct path comment.
  // We intentionally keep their existing header—prepend ours above it.
  const updated = expected + buf;
  await fs.writeFile(file, updated, "utf8");
  return true;
}

async function main() {
  let touched = 0;
  for await (const file of walk(SRC_ROOT)) {
    if (await ensurePathComment(file)) touched++;
  }
  console.log(
    touched === 0
      ? "✅ All files already contained the correct path comment."
      : `✅ Added path comments to ${touched} file${touched === 1 ? "" : "s"}.`
  );
}

main().catch((err) => {
  console.error("❌ add‑path‑comments failed:", err);
  process.exit(1);
});