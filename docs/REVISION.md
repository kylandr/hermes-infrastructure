# Revisión de lo que quedaría visible

Auditoría hecha el 2026-11-16 sobre el árbol que se publicaría: archivos
rastreados, capturas y metadatos de los commits. Nada está publicado: el
repositorio no tiene remoto y los tres commits viven solo en disco.

## 1. Resumen

| Elemento | Cantidad | Veredicto |
|----------|----------|-----------|
| Archivos rastreados | 28 | Compartibles salvo las decisiones de §4 |
| Capturas de pantalla | 4 | Las 4 compartibles, sin edición |
| Commits | 3 en `main` + 1 en la rama de propuesta | Compartibles; autoría ya normalizada |
| Secretos, IPs de malla, teléfonos, correos | 0 hallazgos | Compartible |

## 2. Archivos

Lista completa y actualizada: `evidencia/archivos-propuestos.txt`.

| Grupo | Archivos | Estado |
|-------|----------|--------|
| Documentos | `README.md`, `docs/ALCANCE.md`, `docs/ARQUITECTURA.md`, `docs/FLUJO-DOCUMENTACION.md`, `docs/MCP-GOOGLE-FLOW.md`, `docs/REVISION.md` | Compartibles |
| Demo | `site/index.md`, `site/guia/flujo-de-cambios.md`, 3 páginas en `site/wiki/`, `.vitepress/config.mjs`, `package.json` | Compartibles |
| Dependencias fijadas | `site/package-lock.json` (~2.550 líneas) | Compartible; no aporta contenido propio |
| Evidencia | 4 capturas, 4 registros de salida, 1 diff, 2 documentos y 1 lista de archivos | Compartibles; ver §3 |
| Configuración | `.gitignore` | Compartible |

Nada del árbol contiene: configuración real del agente, memorias, `SOUL.md`,
cron, `.env`, tokens, claves, rutas con nombre de usuario (`~/` desde la
normalización), IPs de la malla privada, nombre de host ni número de teléfono.
Las únicas direcciones son ejemplos de laboratorio (`192.168.1.0/24`,
`10.0.0.0/24`), documentadas como tales en `docs/ALCANCE.md`.

## 3. Capturas

| Archivo | Qué muestra | Veredicto |
|---------|-------------|-----------|
| `evidencia/demo-portada.png` | Portada de la demo, tema oscuro | **Compartible**, sin edición |
| `evidencia/demo-vlans-pfsense.png` | Página de VLANs en pfSense | **Compartible**, sin edición |
| `evidencia/demo-flujo.png` | Guía del flujo de cambios | **Compartible**, sin edición |
| `evidencia/demo-propuesta-routing.png` | Sección nueva de la propuesta, compilada desde la rama | **Compartible**, sin edición |

Las cuatro se revisaron con inspección visual: no hay barra de direcciones,
pestañas, marcadores, correo, usuario ni ruta del sistema. Solo muestran la
interfaz del sitio y su contenido. Al ser capturas de una página compilada, no
prueban configuración del sistema; por eso cada una va acompañada del registro
de CLI correspondiente (`demo-http-check.txt`, `propuesta-http-check.txt`).

Si se prefiere un paquete más ligero, las tres primeras son opcionales: el
`README` ya incluye la salida de compilación y las respuestas HTTP en texto.

## 4. Commits visibles

```
bfb05f4  propuesta: verificación de rutas antes de publicar en RouterOS 7   (rama)
65cf4dd  fix(site): enlaces relativos en portada y página de agentes
9b74938  docs: demo verificada, estado del respaldo y MCP en evaluación
5d422c0  Borrador público de Hermes Infrastructure
```

Autor y committer en los cuatro: `Stiven Polania <kylandr@users.noreply.github.com>`.
No aparece el correo local, ni el nombre de la máquina, ni rutas del sistema: el
historial nuevo se creó con identidad explícita en cada commit.

Fechas: 2026-11-16 (misma jornada). El historial no hereda las fechas del
proyecto original; esas fechas están en la tabla de hitos del `README`, cada una
con su commit de origen en el repositorio privado.

**Requiere edición:** ninguna del historial. Si en algún momento se publica en
GitHub, conviene confirmar que la cuenta `kylandr` es la que firma (el
`noreply` usado corresponde a esa cuenta).

## 5. Lo que sí requiere una decisión

| Tema | Por qué | Opciones |
|------|---------|----------|
| Licencia | el proyecto original era privado, sin licencia heredable | MIT · CC BY 4.0 + MIT · sin licencia |
| Nombres de terceros | `docs/MCP-GOOGLE-FLOW.md` nombra `Mitanshp5`, `madzabreu`, `GTAI-1`, `kodelyx` | mantener la atribución (recomendado, es la licencia MIT) o reducir a "proyecto de terceros" |
| Capturas | 3 de las 4 son opcionales | incluirlas o dejar solo la de la propuesta |
| Propuesta de routing | el cambio no se probó en un router real | publicar como procedimiento citado · esperar verificación en laboratorio |
| Contenido de la wiki | la demo expone 3 de 139 páginas | mantener solo la demo (recomendado para el borrador) |
| Nombre del remoto | todavía no existe | `hermes-infrastructure` (decidido), falta elegir visibilidad |

## 6. Enlaces de revisión en local

```
Repo:            ~/Proyectos/hermes-public-work/hermes-infrastructure
README:          ~/Proyectos/hermes-public-work/hermes-infrastructure/README.md
Auditoría:       ~/Proyectos/hermes-public-work/hermes-infrastructure/docs/REVISION.md
Propuesta:       ~/Proyectos/hermes-public-work/hermes-infrastructure/evidencia/propuesta-verificacion-routing.md
Diff:            ~/Proyectos/hermes-public-work/hermes-infrastructure/evidencia/propuesta-routing.diff
Capturas:        ~/Proyectos/hermes-public-work/hermes-infrastructure/evidencia/demo-*.png
```

Para ver el sitio:

```bash
cd ~/Proyectos/hermes-public-work/hermes-infrastructure/site
npm install
npx vitepress dev                    # http://localhost:5173
# o, para rutas limpias como en producción:
npx vitepress build && npx vitepress preview   # http://localhost:4173
```

Para ver la propuesta compilada:

```bash
git switch propuesta/verificacion-routing-routeros7
cd site && npx vitepress build && npx vitepress preview
```

## 7. Comprobaciones ejecutadas

- Enlaces relativos del Markdown: 0 rotos (comprobador sobre un clon limpio sin
  `node_modules`).
- Compilación en clon limpio: `npm ci` + `vitepress build` → 6 HTML.
- Barrido de secretos y datos: sin hallazgos fuera de los placeholders.
- Origen privado intacto: `git -C source-backup status --short` vacío, HEAD en
  `16452b1`.
- Repositorio público sin remoto: `git remote -v` vacío.
