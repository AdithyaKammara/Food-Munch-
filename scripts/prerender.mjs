// Prerenders the single page into dist/index.html after `vite build`, so the browser can paint
// the hero before any script runs; main.tsx then hydrates it. No extra packages: Vite builds
// src/entry-server.tsx for Node, and React's own renderToString does the rest.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const page = 'dist/index.html'
const outDir = mkdtempSync(join(tmpdir(), 'food-munch-prerender-'))

try {
  await build({
    logLevel: 'warn',
    // Bundle every dependency, so Node never has to resolve packages that only ship for bundlers.
    ssr: { noExternal: true },
    build: { ssr: 'src/entry-server.tsx', outDir, emptyOutDir: true, copyPublicDir: false },
  })
  const { render } = await import(pathToFileURL(join(outDir, 'entry-server.js')).href)

  const html = readFileSync(page, 'utf8')
  const mount = '<div id="root"></div>'
  if (!html.includes(mount)) throw new Error(`${page} has no empty ${mount} to fill`)
  // A function replacement, so `$` sequences in the markup are kept as they are.
  writeFileSync(page, html.replace(mount, () => `<div id="root">${render()}</div>`))
  console.log(`Prerendered ${page}`)
} finally {
  rmSync(outDir, { recursive: true, force: true })
}
