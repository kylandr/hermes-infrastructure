import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const WIKI = path.join(ROOT, 'wiki')

const LABEL = {
  mikrotik: 'MikroTik',
  pfsense: 'pfSense',
  hermes: 'Hermes',
}

// Barra lateral derivada del sistema de archivos: misma idea que el
// config.mjs del proyecto privado, reducida a las páginas de la demo.
function scanDir(rel) {
  const abs = path.join(WIKI, rel)
  if (!fs.existsSync(abs)) return []
  return fs.readdirSync(abs, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(e => !e.name.startsWith('.'))
    .map(e => {
      if (e.isDirectory()) {
        const sub = scanDir(path.posix.join(rel, e.name))
        return sub.length ? { text: LABEL[e.name] ?? e.name, collapsed: false, items: sub } : null
      }
      if (!e.name.endsWith('.md') || e.name === 'index.md') return null
      return {
        text: e.name.replace(/\.md$/, '').replace(/-/g, ' '),
        link: '/wiki/' + (rel ? rel + '/' : '') + e.name.replace(/\.md$/, ''),
      }
    })
    .filter(Boolean)
}

export default defineConfig({
  lang: 'es-CO',
  title: 'Hermes Infrastructure',
  description: 'Demo de la wiki técnica: documentación, revisión y publicación',
  appearance: 'dark',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Flujo de cambios', link: '/guia/flujo-de-cambios' },
    ],
    sidebar: [
      {
        text: 'Guía',
        items: [{ text: 'Flujo de cambios', link: '/guia/flujo-de-cambios' }],
      },
      { text: 'Wiki', items: scanDir('') },
    ],
    search: { provider: 'local' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    outline: { label: 'En esta página' },
    darkModeSwitchLabel: 'Tema',
    returnToTopLabel: 'Volver arriba',
  },
})
