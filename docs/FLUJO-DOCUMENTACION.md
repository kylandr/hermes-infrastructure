# Flujo de documentación: propuesta → revisión → publicación

Este documento describe el ciclo **tal como está implementado hoy** y marca de
forma explícita cada etapa que falta. Se apoya en el script real de publicación
(`rebuild.sh`) y en las reglas del perfil de documentación.

## Resumen del ciclo

```
1. Orden         "investiga X y agrégalo a la wiki"
2. Investigación búsqueda + extracción de fuentes oficiales
3. Propuesta     el agente escribe el .md en el árbol de trabajo
4. Verificación  regenerar índices + compilar (rebuild.sh)
5. Publicación   commit a la rama principal y recarga del sitio
```

| Etapa | ¿Implementada? | Evidencia |
|-------|----------------|-----------|
| 1. Orden explícita | Sí | regla del perfil: solo documenta bajo orden |
| 2. Investigación | Sí | reglas: 1 búsqueda, máx. 2 extracciones por tema |
| 3. Propuesta | **Parcial** | escribe el archivo, pero sin rama, parche ni vista previa del diff |
| 4. Verificación | Sí | `rebuild.sh` compila y falla si no se genera `dist/index.html` |
| 5. Publicación | Sí | `rebuild.sh --commit "…"` hace `git add -A && git commit` |
| 6. Revisión humana previa | **Pendiente** | no hay paso de aprobación: el commit ocurre en la misma orden |
| 7. Distribución a la estación | **Pendiente** | el temporizador de sincronización descrito no existe |
| 8. Respaldo posterior | **Pendiente** | último respaldo 2026-10-06; script y cron ausentes |

## 3. Cómo el agente genera una propuesta de cambio

La "propuesta" es hoy un **archivo nuevo o modificado en el árbol de trabajo**,
no un parche aislado. Secuencia real:

1. `web_search` sobre la documentación oficial del fabricante o servicio.
2. `web_extract` (máximo dos URLs) para obtener el contenido de referencia.
3. `write_file` en `wiki/<categoría>/<tema>.md` con frontmatter obligatorio:

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

4. Secciones estándar: TL;DR, definición, cómo funciona, comandos/Configuración,
   troubleshooting, ver también, fuentes.
5. No edita el índice a mano: `rebuild.sh` lo regenera.

**Lo que falta aquí:** el cambio no se aísla. No se crea una rama, no se
produce un parche revisable y no hay una vista previa local antes de tocar la
rama principal. Si el agente se equivoca, el error entra directamente en el
histórico publicado.

## 4. Cómo lo reviso

Estado actual: la revisión es **posterior al commit**, con Git como única
herramienta:

```bash
cd ~/wiki
git log --oneline -5              # qué se publicó
git show --stat HEAD              # qué archivos tocó
git diff HEAD~1 -- wiki/mikrotik/ # contenido exacto del cambio
```

Y con el sitio en marcha, abrir la página y comprobar que compila y responde.
Lo que **no** existe: una comprobación automática de enlaces, de frontmatter o
de fuentes citadas, ni una aprobación registrada antes de publicar.

## 5. Cómo se publica

`rebuild.sh` es el publicador real. Hace tres cosas y falla ruidosamente si la
segunda no se cumple:

```bash
python3 <<'PYEOF'   # 1. regenera índices de cada categoría y la portada
...
PYEOF

rm -rf .vitepress/cache
npx vitepress build 2>&1 | tail -4          # 2. compila

if [ -f .vitepress/dist/index.html ]; then   # 3. valida el artefacto
  echo "OK: build en .vitepress/dist"
else
  echo "FALLO: no se genero .vitepress/dist/index.html"; exit 1
fi

if [ "${1:-}" = "--commit" ]; then           # 4. publica en Git (opcional)
  git add -A && git commit -q -m "${2:-docs: rebuild}"
fi
```

El sitio se sirve con un servicio de sistema (`wiki-server`) que apunta a
`.vitepress/dist`; la comprobación en vivo del 2026-11-16 devolvió HTTP 200.

Observación de mantenimiento: el `rebuild.sh` del respaldo privado es una
versión anterior (fechas fijas `2026-10-05`, sin validación del artefacto, sin
`--commit`). El repositorio de respaldo no refleja el script que corre en
producción; otra consecuencia del respaldo detenido.

## 6. Etapas pendientes, y cómo cerrarlas

Propuesta concreta para completar el ciclo sin reescribir lo que ya funciona:

```bash
# 3-bis. Propuesta aislada: el agente trabaja en una rama
git switch -c propuesta/<tema>
# ... escribe el .md ...
./rebuild.sh                       # compila y valida, sin publicar

# 4-bis. Revisión registrada
git diff --stat
git diff -- wiki/<cat>/<tema>.md
# criterios: frontmatter completo, fuentes verificables, sin datos internos

# 5-bis. Publicación sólo tras aprobación
git switch main && git merge --ff-only propuesta/<tema>
./rebuild.sh --commit "docs: <tema>"
```

Checklist mínima de revisión que hoy no está automatizada:

- [ ] frontmatter con `title`, `tags`, `created`, `updated`, `sources`,
      `confidence`
- [ ] al menos una fuente oficial en `sources`
- [ ] la página compila y aparece en el índice de su categoría
- [ ] sin credenciales, IP internas ni datos personales en el texto
- [ ] `git diff` limitado a la categoría del tema

Con eso, las tres etapas marcadas como pendientes (revisión previa,
distribución a la estación y respaldo posterior) quedan resueltas: revisión por
rama + diff, distribución por un temporizador de sincronización y respaldo por
un cron independiente del modelo.

## 7. Aplicación a este repositorio público

La versión pública se construyó **sin tocar el respaldo**: se clonó el
repositorio privado en un directorio nuevo, se leyó su contenido y se generó un
repositorio distinto con historial propio. El respaldo y su historial quedaron
intactos (último commit del original: `16452b1`, 2026-10-06).
