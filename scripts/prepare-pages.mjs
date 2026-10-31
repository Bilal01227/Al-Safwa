import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const routes = ['products','brands','rental','services','repair','request-quote','contact'];
const root = await readFile('dist/index.html','utf8');
for (const route of routes) {
  const dir = path.join('dist',route);
  await mkdir(dir,{recursive:true});
  await writeFile(path.join(dir,'index.html'),root);
}
console.log('Generated static route entry points.');
