# Verificación del borrador público

Fecha: 2026-11-16. Todo lo que sigue se ejecutó sobre
`~/Proyectos/hermes-public-work/hermes-infrastructure`.

## 1. Origen intacto

```
$ cd ~/Proyectos/hermes-public-work/source-backup
$ git status --short
(vacío)
$ git log -1 --format='%h %ad %s' --date=iso
16452b1 2026-10-06 03:34:32 +0000 Backup: 2026-10-06 03:34 UTC
$ git log --oneline | wc -l
9
```

El clon se hizo con `gh` (HTTPS, token de la sesión). No hubo `push`, ni
`rebase`, ni escritura sobre el repositorio privado.

## 2. Compilación VitePress

```
$ cd site && npm install    → added 125 packages
$ npx vitepress build
vitepress v1.6.4
✓ building client + server bundles...
✓ rendering pages...
build complete in 2.20s.
```

Salida: `site/.vitepress/dist` (1,3 MB, 6 HTML). Registro completo en
`vite-build.log`.

## 3. Servido y respuesta HTTP

`npx vitepress preview --port 8100` (necesario para `cleanUrls`):

```
/                                -> 200
/guia/flujo-de-cambios           -> 200
/wiki/mikrotik/routing           -> 200
/wiki/pfsense/vlans              -> 200
/wiki/hermes/agentes-ia          -> 200
```

Detalle en `demo-http-check.txt`; capturas en `demo-portada.png`,
`demo-vlans-pfsense.png`, `demo-flujo.png`.

Nota: con `python3 -m http.server` las rutas limpias dan 404 porque ese servidor
no reescribe `.html`; no es un fallo del sitio.

## 4. Contenido renderizado

Títulos extraídos del HTML compilado:

```
Hermes Infrastructure
Flujo de cambios: propuesta, revisión y publicación | Hermes Infrastructure
Routing MikroTik | Hermes Infrastructure
Configuración de VLANs en pfSense | Hermes Infrastructure
Agentes de IA Autónomos 2026 | Hermes Infrastructure
```

Comprobado visualmente: tema oscuro, barra lateral, buscador local, sin
frontmatter visible en el cuerpo.

## 5. Correcciones aplicadas a las páginas copiadas

- `pfsense/vlans.md`: el frontmatter venía como texto en negrita **en medio**
  del documento (no era YAML). Se movió al inicio y se convirtió en YAML válido;
  se eliminó un H1 duplicado.
- `hermes/agentes-ia.md`: tres enlaces internos apuntaban a páginas no incluidas
  en la demo; se redirigieron a la guía o a la fuente externa.

## 6. Depuración

Búsquedas ejecutadas sobre el repositorio (excluyendo `node_modules` y `dist`):

| Patrón | Resultado |
|--------|-----------|
| IP de malla `100.64.0.0/10` | ninguna |
| Teléfonos y correos | ninguno |
| `/home/opc`, `/home/kylandr`, `arch5350`, `vps-hermes` | ninguno (normalizado a `~/`) |
| Tokens (`gho_`, `ghp_`, `sk-…`, claves SSH) | ninguno |
| `Stiven`, `SENA`, `kylandr` | solo en la autoría y en la ruta del proyecto MCP |

Ver detalle del criterio en `docs/ALCANCE.md`.

## 7. Prueba del MCP (resumen)

`initialize` + `tools/list` por stdio → 16 herramientas; 15 pruebas unitarias
pasan en 2 archivos. Suite completa no terminada (>180 s, requiere navegador
autenticado). Registro en `mcp-tools-list.txt`.

## 8. Pendiente antes de publicar

1. Elegir licencia (no se incluyó `LICENSE` a propósito).
2. Decidir si se publican las capturas de pantalla (contienen solo la demo).
3. Confirmar que el nombre del repositorio público sea `hermes-infrastructure`.
4. Decidir si se añade una página de índice de la wiki original o solo la demo.
5. Reparar el respaldo detenido y el `rebuild.sh` desactualizado del repo
   privado (fuera del alcance de este borrador, pero señalado).
