import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../data/site.json", import.meta.url);
const targetDir = new URL("../public/data/", import.meta.url);
const targetPath = new URL("../public/data/site.json", import.meta.url);

await mkdir(targetDir, { recursive: true });

const data = JSON.parse(await readFile(sourcePath, "utf8"));
data.inquiries = [];

await writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`);

try {
  await copyFile(new URL("../data/.gitkeep", import.meta.url), new URL("../public/data/.gitkeep", import.meta.url));
} catch {
  // Optional placeholder only.
}
