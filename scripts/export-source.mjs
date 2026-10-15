import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(name)));
    else files.push(name);
  }
  return files;
}

const rootFiles = [
  ".gitignore",
  ".prettierrc.json",
  "README.md",
  "eslint.config.mjs",
  "next-env.d.ts",
  "next.config.ts",
  "package.json",
  "package-lock.json",
  "postcss.config.mjs",
  "tailwind.config.ts",
  "tsconfig.json",
];
const files = [
  ...rootFiles,
  ...(await listFiles("src")),
  ...(await listFiles("scripts")),
  ...(await listFiles("tests")),
].sort();
const languages = {
  ".tsx": "tsx",
  ".ts": "typescript",
  ".mjs": "javascript",
  ".css": "css",
  ".json": "json",
  ".md": "markdown",
};
let output = "# FormFlow — complete Phase 2 source\n\n";
output +=
  "Every Phase 2 file is reproduced in full below. The unchanged design reference, installed dependencies, build output, and this generated document are excluded.\n\n";
output += `## File inventory (${files.length} files)\n\n`;
output += files.map((file) => `- \`${file}\``).join("\n") + "\n\n";
for (const file of files) {
  const content = await readFile(file, "utf8");
  output += `## ${file}\n\n\`\`\`\`${languages[path.extname(file)] ?? "text"}\n${content.trimEnd()}\n\`\`\`\`\n\n`;
}
await writeFile("PHASE_2_SOURCE.md", output);
console.log(`Exported ${files.length} complete files to PHASE_2_SOURCE.md.`);
