# MCP de Google Flow: hallazgo, origen, cambios y prueba

Búsqueda realizada el 2026-11-16 en los directorios de proyectos, la
configuración de Hermes y el VPS.

## 1. Resultado

Encontrado. La copia viva y más reciente es un **fork propio** de un servidor
MCP de terceros, con 10 commits propios y 62 archivos modificados.

| Dato | Valor |
|------|-------|
| Ruta | `~/Proyectos/activos/flow-studio-mcp` (antes `~/flow-studio-mcp`) |
| Origen | `https://github.com/Mitanshp5/Google-Flow_MCP` (remoto `origin`, rama `master`) |
| Punto de bifurcación | `49e34e4` (2026-10-17, último commit ajeno en la rama) |
| Autoría original | Mitansh Prajapati (`Mitanshp5`) y `madzabreu` |
| Licencia | **MIT**, `Copyright (c) 2026 Mitanshp5` |
| Versión declarada | `package.json` 1.1.0 · `serverInfo` 2.0.0 · README "v3.0" |
| Último commit | `242a63c` (2026-10-31), "feat(v2.6)…" |
| Actividad posterior | logs y capturas de operación hasta 2026-11-05 |

## 2. Copias encontradas

| Copia | Origen | Licencia | Estado |
|-------|--------|----------|--------|
| `Proyectos/activos/flow-studio-mcp` | fork de `Mitanshp5/Google-Flow_MCP` | MIT | **más reciente y modificada**; última actividad 2026-11-05 |
| `.hermes_backup_pre_factory_reset_…/disabled_skills/google-flow-backup-…/flow-mcp` | `GTAI-1/flow-mcp` | ISC | copia de un proyecto **distinto**; 63 commits, todos del autor original, sin cambios propios |
| `.hermes_backup_pre_factory_reset_…/disabled_skills/google-flow-backup-…/flow-agent` | `kodelyx/flow-agent` | — | agente/extensión relacionada, no es un servidor MCP |
| VPS Oracle | — | — | sin copia; la configuración del VPS no menciona Flow |

La copia de `disabled_skills` está dentro de un respaldo previo a un reseteo de
fábrica; su nombre indica que la habilidad fue deshabilitada. No es la misma
base de código: su `package.json` se llama `flow-mcp`, usa TypeScript y
`playwright-core`.

## 3. Qué se modificó (diff contra el punto de bifurcación)

```
62 archivos cambiados, 5575 inserciones(+), 2329 eliminaciones(-)
16 módulos de herramienta nuevos en src/tools/
```

Cambios principales, agrupados por función:

- **Continuidad de personajes y escenario**: "3 ingredientes" (dos personajes +
  placa de locación vacía) para evitar que el fondo cambie entre planos;
  detección de medio visual (35 mm, stickman 2D, 3D) y reglas de encuadre.
- **Creación paralela de personajes**: pestañas concurrentes por CDP, voz
  personalizada y cuerpo completo, reutilización de personajes ya presentes.
- **Animación imagen-a-vídeo sin cortes internos**: bloqueo de continuidad con
  marcas de tiempo, duraciones 4/6/8/10 s y diálogo con lip-sync en español.
- **Ensamblaje y masterización**: descarga del ZIP oficial del proyecto,
  normalización a 24 fps, 48 kHz y −14 LUFS, concatenación con `ffmpeg`.
- **Herramientas propias añadidas**: `flow_animate_card_to_video`,
  `flow_create_characters_parallel`, `flow_assemble_full_story`,
  `flow_master_reel`, `flow_plan_reel`, `flow_render_motion_graphics`,
  `flow_render_hyperframes`, `flow_export_reel`, `flow_use_grid_architect`,
  `flow_generate_talking_clip`, `flow_build_viral_showcase`, entre otras.
- **Compatibilidad con agentes**: esquemas "planos" además de los anidados, para
  que modelos locales y en la nube no fallen al serializar argumentos.
- **Utilidades**: `src/utils/tiktok-assembler.js`, `src/produce-kylandr.js`,
  `src/browser-session.js`, scripts de operación y pruebas.

## 4. ¿Se usó con Hermes?

**No puedo confirmarlo por configuración, y hay evidencia de que sí se operó.**

- La configuración actual de Hermes (`~/.hermes/config.yaml`) **no registra**
  ningún servidor `flow_studio` ni `google-flow`: `hermes mcp list` solo muestra
  `hf_media`, deshabilitado. Tampoco aparece en los perfiles `codex` ni
  `opencode`, ni en el VPS.
- Sí existen rastros de uso con Hermes: el repositorio incluye
  `examples/HERMES_SOUL.md`, su README documenta el bloque `mcp_servers` para
  Hermes, hay un perfil de Chrome dedicado (`~/.config/chrome-hermes-flow`) y
  logs/capturas de operación de 2026-11-01 a 2026-11-05.

Conclusión: el servidor fue **construido y probado para Hermes** y se operó con
un navegador dedicado, pero en la configuración actual no está dado de alta como
servidor MCP. Para usarlo hoy hay que registrarlo (bloque de ejemplo en el
README del proyecto) o lanzarlo por CLI.

## 5. Prueba reproducida

Handshake MCP real por `stdio` contra el artefacto compilado:

```
$ printf '%s\n' "$INIT" "$TOOLS_LIST" | node dist/index.js
[INFO] Google Flow Browser MCP server running on stdio
{"result":{"protocolVersion":"2024-11-05",
 "serverInfo":{"name":"flow-studio-mcp","version":"2.0.0"}}}
# tools/list → 16 herramientas
```

Herramientas expuestas:

```
flow_animate_card_to_video   flow_produce_multishot_sequence
flow_assemble_full_story     flow_create_characters_parallel
flow_generate_talking_clip   flow_master_reel
flow_render_motion_graphics  flow_inspect_clips
flow_render_hyperframes      flow_build_viral_showcase
flow_connect                 flow_list_projects
flow_status                  flow_generate_image
flow_export_reel             flow_use_grid_architect
```

Pruebas unitarias (sin navegador ni sesión de Google):

```
$ npx vitest run tests/sanitize.test.js tests/pure-gaps.test.js
 ✓ tests/sanitize.test.js (9 tests)
 ✓ tests/pure-gaps.test.js  (6 tests)
 Test Files  2 passed (2)
      Tests  15 passed (15)
```

La suite completa se intentó y **no terminó** dentro de 180 s: incluye pruebas de
integración que esperan el render de escenas en Google Flow y agotan el tiempo
sin una sesión de navegador autenticada. No se ejecutó ninguna generación real
(eso consume créditos y requiere una cuenta).

## 6. Notas para publicar

- El código **no se copia** a este repositorio: se mantiene en su fork y bajo su
  licencia MIT, con la atribución a Mitansh Prajapati. Publicar el fork exigiría
  conservar `LICENSE` y el aviso de copyright.
- El archivo `.env` del proyecto contiene URLs de proyecto y correos de la
  cuenta de Google: **no** se incluye ni se cita.
- Inconsistencia a corregir antes de cualquier publicación: tres números de
  versión distintos (1.1.0 / 2.0.0 / v3.0) para el mismo artefacto.
