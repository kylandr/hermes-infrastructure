# Hermes Infrastructure

Infraestructura personal de documentación técnica y agentes de IA: una wiki
VitePress de redes y sistemas, un agente que la redacta y la publica, y un
mecanismo de respaldo versionado.

Autor: **Stiven Polania — aprendiz del Tecnólogo en Gestión de Redes de Datos
del SENA**.

---

## 1. Objetivo

Demostrar, con un sistema real y verificable, un ciclo completo de
documentación técnica asistida por IA:

1. **Capturar** conocimiento de redes y sistemas (pfSense, Cisco, Huawei,
   MikroTik, Aruba, Linux, Windows Server, Docker, GLPI, Zabbix, seguridad).
2. **Producir** páginas con estructura uniforme y fuentes citadas.
3. **Publicar** un sitio estático navegable y con búsqueda.
4. **Conservar** el histórico del contenido y de la configuración del agente
   en un repositorio Git.

El interés no está en la cantidad de páginas, sino en el **flujo**: cómo una
orden en lenguaje natural termina siendo una página compilada y versionada, y
qué partes de ese flujo son automatización real y cuáles solo están descritas.

---

## 2. Mi aporte

- **Diseño del flujo de documentación**: definición del formato de página
  (frontmatter con `title`, `tags`, `created`, `updated`, `sources`,
  `confidence`), del orden de secciones y de la regla de compilar y verificar
  antes de declarar un tema como documentado.
- **Especificación del comportamiento del agente** (archivos de instrucciones
  por perfil): solo documenta bajo orden explícita, una búsqueda y como máximo
  dos extracciones por tema, páginas modulares, frontmatter obligatorio,
  compilación posterior y commit descriptivo.
- **Estructura de la wiki**: 13 categorías iniciales organizadas por dominio
  (fabricante de red, sistema operativo, servicio), con índices generados por
  script y barra lateral derivada del sistema de archivos.
- **Automatización**: generación de índices por categoría, compilación
  VitePress y publicación del sitio; respaldo versionado del contenido y de la
  configuración del agente.
- **Integración de un servidor MCP de terceros** (Google Flow) con
  modificaciones propias, documentada en `docs/MCP-GOOGLE-FLOW.md`.

La inferencia y la escritura las ejecuta el agente; el diseño del flujo, las
reglas, la estructura y la verificación son aporte propio. Esa separación se
mantiene explícita en todo el repositorio: no se presentan como propias las
páginas redactadas por el agente ni el código de los proyectos de terceros.

---

## 3. Arquitectura

```
                        Tailscale (red privada)
                    ┌──────────────┴──────────────┐
                    │                             │
          ┌─────────▼─────────┐         ┌─────────▼──────────┐
          │ Estación Arch     │         │ VPS Oracle (ARM)   │
          │                   │         │  (siempre activo)  │
          │ • Hermes Agent    │         │ • Hermes Agent     │
          │   perfil default  │         │   perfiles wiki/git│
          │ • Gateway         │         │ • wiki-server      │
          │ • Puente WhatsApp │         │   (VitePress, HTTP)│
          │ • Navegador CDP   │         │ • cron semanal     │
          └─────────┬─────────┘         └─────────┬──────────┘
                    │                             │
                    │   contenido .md + rebuild   │
                    └──────────────┬──────────────┘
                                   │
                        ┌──────────▼───────────┐
                        │ wiki/  (fuente .md)  │
                        │ .vitepress/config    │
                        │ rebuild.sh → build   │
                        └──────────┬───────────┘
                                   │ git commit / push
                        ┌──────────▼───────────┐
                        │ Repositorio privado  │
                        │ (contenido + config) │
                        └──────────────────────┘
```

Capas:

| Capa | Componente | Función |
|------|-----------|---------|
| Red | Tailscale | Enlace privado entre estación y VPS, sin puertos públicos |
| Cómputo | Estación Arch / VPS Oracle ARM | Ejecución del agente y del sitio |
| Agente | Hermes Agent (perfiles separados) | Redacción, publicación, respaldo |
| Publicación | VitePress + `rebuild.sh` | Sitio estático con búsqueda local |
| Persistencia | Git | Histórico de contenido y configuración |

---

## 4. Hitos (fechas respaldadas por Git)

Todas las fechas provienen de commits reales; la columna *Evidencia* indica
dónde verificarlas.

| Fecha | Hito | Evidencia |
|-------|------|-----------|
| 2026-10-05 | Arranque de la wiki: primeras páginas de pfSense, Zabbix, GLPI y fabricantes de red | repo de la wiki, commit inicial `54eeadc` ("Ingesta: pfSense VLAN installation"); 90 commits entre 2026-10-05 y 2026-11-07 |
| 2026-10-05 16:14 UTC | Creación del repositorio de respaldo | `ebcb3fe` "Init: repositorio de backup Hermes" |
| 2026-10-05 | Primera documentación completa del sistema (arquitectura, componentes, flujos, bots, respaldo) | `a3e3412` "Docs: documentacion completa del proyecto", 9 documentos en `docs/` |
| 2026-10-06 03:34 UTC | Último respaldo automático registrado | `16452b1` "Backup: 2026-10-06 03:34 UTC" (último commit del repo de respaldo) |
| 2026-10-25 | Trabajo sobre el MCP de Google Flow: modo turbo, pestañas paralelas, dirección cinematográfica | repo `flow-studio-mcp`, 8 commits de ese día (`13afde3` … `b201e32`) |
| 2026-10-26 | Cierre del pipeline v2.5 (3 ingredientes, lote imagen-a-vídeo, esquemas planos) | `e1a15ea` "release: pipeline v2.5 completo" |
| 2026-10-31 | v2.6: esquema completo de 3 ingredientes y sincronía de audio | `242a63c` "feat(v2.6)…" |
| 2026-11-07 | Actualización de la wiki en producción (AdGuard Home, homepage, limpieza de Zabbix) | repo de la wiki, `0c766d5` "docs: adguard home + homepage" |

Lectura honesta del histórico: el contenido creció en dos ráfagas (5–6 de
octubre y 7 de noviembre) y el respaldo automático **se detuvo el 6 de octubre**.
El repositorio de respaldo no contiene nada posterior a esa fecha.

---

## 5. Estado real: qué funciona y qué solo está documentado

Verificado el 2026-11-16 contra el entorno en ejecución.

| Pieza | Estado | Comprobación |
|-------|--------|--------------|
| Wiki publicada (VitePress) | **Funciona** | `wiki-server` activo; `GET /wiki/` → HTTP 200; 139 páginas `.md` |
| Generación de índices + compilación (`rebuild.sh`) | **Funciona** | script presente en el servidor de la wiki; recompila y reinicia el servicio |
| Agente que redacta y publica | **Funciona** | un cron semanal de novedades existe y se dispara (última ejecución intentada 2026-11-16) |
| Respaldo automático diario | **Solo documentado / detenido** | último commit de respaldo 2026-10-06; no existe el script `hermes-backup.sh` en el VPS ni un cron de respaldo en la lista actual |
| Sincronización estación ↔ VPS cada 2 min | **No presente** | no hay `~/wiki` ni temporizador de sincronización en la estación |
| Revisión formal de cambios (rama/PR/aprobación) | **No implementada** | el agente escribe y hace commit directo; ver `docs/FLUJO-DOCUMENTACION.md` |
| Servidor MCP de Google Flow | **Funciona como servidor** | `tools/list` responde con 16 herramientas; no está registrado en la configuración actual de Hermes |
| Configuración de VitePress dentro del respaldo | **Ausente** | el respaldo no incluye `.vitepress/`: solo el contenido y `rebuild.sh`. El sitio privado compila con una configuración que vive únicamente en el servidor |

---

## 6. Evidencia depurada del flujo

Salida real, recortada, de la comprobación del ciclo documentación → publicación
(2026-11-16):

```
$ systemctl is-active wiki-server      # servicio de sistema en el VPS
active

$ curl -s -o /dev/null -w '%{http_code}\n' http://<vps>:8080/wiki/
200

$ find ~/wiki/wiki -name '*.md' | wc -l
139

$ cd ~/wiki && git log --oneline | wc -l
90
```

Respaldo:

```
$ cd ~/hermes-backup && git log -1 --format='%ad %h %s' --date=iso
2026-10-06 03:34:32 +0000 16452b1 Backup: 2026-10-06 03:34 UTC

$ ls ~/bin/hermes-backup.sh ~/.hermes/scripts/hermes-backup.sh
No such file or directory        # el automatismo descrito ya no existe
```

Servidor MCP de Google Flow (handshake MCP real por stdio):

```
$ printf '%s\n' "$INIT" "$TOOLS_LIST" | node dist/index.js
INFO  Google Flow Browser MCP server running on stdio
{"result":{"protocolVersion":"2024-11-05","serverInfo":{"name":"flow-studio-mcp","version":"2.0.0"}}}
# 16 herramientas expuestas, entre ellas: flow_create_scene,
# flow_animate_card_to_video, flow_assemble_full_story, flow_export_reel

$ npx vitest run tests/sanitize.test.js tests/pure-gaps.test.js
Test Files  2 passed (2)
     Tests  15 passed (15)
```

Comandos reproducibles y su salida completa están en `evidencia/`.

---

## 7. Contenido de este repositorio

```
.
├── README.md                    # este documento
├── docs/
│   ├── ARQUITECTURA.md          # diseño del sistema (versión pública)
│   ├── FLUJO-DOCUMENTACION.md   # propuesta → revisión → publicación
│   ├── MCP-GOOGLE-FLOW.md       # hallazgo, origen, licencia, cambios, prueba
│   └── ALCANCE.md               # qué se excluyó y por qué
├── site/                        # demo local de la wiki (VitePress)
│   ├── .vitepress/config.mjs
│   ├── index.md
│   ├── guia/flujo-de-cambios.md
│   └── wiki/{hermes,mikrotik,pfsense}/*.md
└── evidencia/                   # compilación y pruebas
```

Cómo ver la demo:

```
cd site
npm install
npx vitepress dev      # http://localhost:5173
npx vitepress build    # salida en .vitepress/dist
```

---

## 8. Qué **no** está en este repositorio

- Credenciales, tokens, `.env`, `auth.json` ni configuración real del agente.
- Direcciones internas (IP de la malla privada, nombres de host, puertos de
  administración) y datos personales (teléfono, correo, cuentas).
- Habilidades (skills) de Hermes Agent: son contenido de terceros, no aporte
  propio, y se excluyeron completas.
- Código del MCP de Google Flow: solo se documenta; su licencia y autoría se
  respetan y el proyecto original sigue en su repositorio.

Detalle y criterio en `docs/ALCANCE.md` y la lista de archivos en
`evidencia/archivos-propuestos.txt`.

---

## 9. Licencia

**Pendiente de decisión.** El proyecto original era privado y no incluía
licencia pública. Este borrador no impone una: antes de publicar hay que
elegir una (por ejemplo MIT para el texto y la configuración, manteniendo el
código de terceros bajo su licencia original). Ver `docs/ALCANCE.md`.
