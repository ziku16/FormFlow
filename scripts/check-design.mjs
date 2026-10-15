import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { format } from "prettier";

const reference = await readFile("design.html", "utf8");
const referenceCss = reference.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert.ok(referenceCss, "design.html must contain the source stylesheet.");
const tokens = await readFile("src/styles/tokens.css", "utf8");
const styles = await readFile("src/styles/design.css", "utf8");

function declarations(css) {
  const result = [];
  postcss.parse(css).walkDecls((declaration) => {
    const ancestors = [];
    let parent = declaration.parent;
    while (parent && parent.type !== "root") {
      ancestors.unshift(
        parent.type === "atrule"
          ? `@${parent.name} ${parent.params}`
          : parent.selector,
      );
      parent = parent.parent;
    }
    result.push([
      ancestors.join(" > "),
      declaration.prop,
      declaration.value,
      Boolean(declaration.important),
    ]);
  });
  return result;
}

const original = declarations(await format(referenceCss, { parser: "css" }));
const ported = declarations(
  await format(`${tokens}\n${styles}`, { parser: "css" }),
);
assert.deepEqual(
  ported,
  original,
  "Every source CSS declaration must retain its selector, value, priority, and order.",
);
const tokenCount = declarations(tokens).length;
const layout = await readFile("src/app/layout.tsx", "utf8");
const fontUrl = reference.match(
  /href="(https:\/\/fonts.googleapis.com\/css2[^\"]+)"/,
)?.[1];
assert.ok(
  fontUrl && layout.includes(fontUrl),
  "Google Fonts families and requested weights must match design.html.",
);
console.log(
  `Verified ${tokenCount} exact tokens and ${original.length} CSS declarations, including responsive rules and font loading.`,
);
