import { cp, mkdir, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const entries = ['index.html', 'css', 'js', 'assets', 'documents', 'certifs', 'THREE-LICENSE.txt'];

// Validate the prebuilt site before replacing the generated publish directory.
for (const entry of entries) await access(path.join(root, entry));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of entries) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log('Static portfolio prepared in dist/');
