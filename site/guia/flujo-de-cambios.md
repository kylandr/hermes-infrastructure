# Flujo de cambios: propuesta, revisión y publicación

Esta página documenta el ciclo que convierte una orden en lenguaje natural en
una página publicada. Está escrita para que se pueda auditar: cada etapa dice
si existe hoy o si sigue pendiente.

## El ciclo, en una línea

```
orden → investigación → propuesta (.md) → compilación → commit → publicación
                          ▲                    │
                          └── revisión humana: hoy ocurre DESPUÉS del commit
```

## 1. Propuesta: cómo el agente genera un cambio

El agente no abre una rama ni produce un parche: escribe el archivo en el árbol
de trabajo. La propuesta es, literalmente, un `.md` nuevo o modificado.

1. `web_search` sobre la documentación oficial del tema.
2. `web_extract` en una o dos fuentes como máximo.
3. `write_file` en `wiki/<categoría>/<tema>.md` con el frontmatter obligatorio:

```yaml
---
title: "Routing MikroTik"
tags: [mikrotik]
created: 2026-10-05
updated: 2026-10-05
sources: ["https://manual.mikrotik.com/docs/routeros/routing/"]
confidence: alta
---
```

4. Secciones estándar: TL;DR, definición, funcionamiento, comandos,
   troubleshooting, enlaces y fuentes.
5. El índice de la categoría no se edita a mano: lo regenera el script.

::: danger Etapa incompleta
No hay vista previa ni aislamiento del cambio antes de publicar. La propuesta
se escribe sobre la rama principal de trabajo.
:::

## 2. Revisión: cómo lo reviso

La revisión existe, pero es **posterior** al commit y depende de Git:

```bash
cd ~/wiki
git log --oneline -5
git show --stat HEAD
git diff HEAD~1 -- wiki/mikrotik/routing.md
```

Además se abre la página compilada y se comprueba que carga. Lo que no está
automatizado: validación de enlaces, de frontmatter ni de fuentes citadas, y no
queda registro de una aprobación previa.

Checklist mínima que aplico a mano:

- frontmatter completo (`title`, `tags`, `created`, `updated`, `sources`,
  `confidence`)
- al menos una fuente oficial en `sources`
- la página compila y aparece en su índice
- sin credenciales, direcciones internas ni datos personales
- el diff se limita a la categoría del tema

## 3. Publicación: cómo se compila y se publica

`rebuild.sh` es el publicador. Regenera índices, compila y valida:

```bash
./rebuild.sh                          # compila y valida, sin publicar
./rebuild.sh --commit "docs: tema"    # además hace git add -A && git commit
```

Fragmento real del script:

```bash
rm -rf .vitepress/cache
npx vitepress build 2>&1 | tail -4

if [ -f .vitepress/dist/index.html ]; then
  echo "OK: build en .vitepress/dist"
else
  echo "FALLO: no se genero .vitepress/dist/index.html"; exit 1
fi
```

El sitio se sirve desde `.vitepress/dist` con un servicio del sistema. La
comprobación del 2026-11-16 devolvió HTTP 200.

## 4. Etapas pendientes

| Etapa | Estado | Qué falta |
|-------|--------|-----------|
| Propuesta aislada (rama o parche) | Pendiente | `git switch -c propuesta/<tema>` antes de escribir |
| Revisión previa registrada | Pendiente | diff revisado y aprobado antes del merge |
| Validación automática | Pendiente | enlaces, frontmatter y fuentes |
| Distribución a la estación | Pendiente | el temporizador de sincronización no existe |
| Respaldo posterior | Pendiente | último respaldo 2026-10-06; script y cron ausentes |

### Cómo cerrarlas sin reescribir lo que funciona

```bash
git switch -c propuesta/<tema>
# el agente escribe el .md
./rebuild.sh                 # compila, no publica
git diff -- wiki/<cat>/<tema>.md
git switch main && git merge --ff-only propuesta/<tema>
./rebuild.sh --commit "docs: <tema>"
```

## 5. Qué se compiló para esta demo

Este sitio se construyó con un `config.mjs` mínimo escrito para la demo: el
respaldo privado no incluía la carpeta `.vitepress`, así que la configuración se
reconstruyó con la misma forma (título, navegación, barra lateral generada
desde el sistema de archivos, búsqueda local y tema oscuro). La evidencia de la
compilación está en `evidencia/`.

Corrección aplicada a una página: `pfsense/vlans.md` traía el frontmatter como
texto en negrita en medio del documento; se movió al inicio y se convirtió en
YAML válido. Es un ejemplo real del tipo de defecto que la revisión debería
detectar automáticamente.
