# Arquitectura (versión pública)

Documento derivado de `docs/ARQUITECTURA.md` del respaldo privado, con las
direcciones y nombres internos sustituidos por marcadores.

## Visión general

Dos máquinas físicas unidas por una red privada de malla. La estación se usa
para trabajar; el VPS permanece encendido y publica la wiki.

```
[ red privada de malla ]
      |                  |
[ ESTACIÓN ARCH ]   [ VPS ARM ]
      |                  |
 wiki local         wiki publicada
 agente personal    agente documentador
 puente de mensajería  agente de respaldo
 navegador CDP      cron de novedades
      \                  /
       \                /
        [ contenido .md ] → [ build VitePress ] → [ sitio HTTP ]
                       |
                 [ repositorio Git ]
```

## Capas

1. **Red**: malla privada punto a punto; no se exponen puertos públicos. El
   acceso SSH se limita a la malla.
2. **Cómputo**: estación Arch (uso personal) y VPS Oracle Ampere A1 (ARM64,
   24/7).
3. **Aplicación**: Hermes Agent como framework de agentes; VitePress como
   generador del sitio; un puente de mensajería para hablar con el agente.
4. **Datos**: fuente `.md` de la wiki, configuración del agente y repositorio
   Git de respaldo.

## Componentes

| Máquina | Componente | Rol |
|---------|-----------|-----|
| Estación | agente (perfil personal) | Tareas generales, canal de mensajería |
| Estación | servidor de wiki | Sirve la wiki en un puerto local |
| Estación | gateway del agente | Demonio que atiende canales |
| VPS | agente (perfil de documentación) | Redacta y publica páginas |
| VPS | agente (perfil de respaldo) | Ejecuta el respaldo versionado |
| VPS | `wiki-server` | Sirve el sitio compilado (servicio de sistema) |
| VPS | cron | Novedades semanales de la wiki |

## Flujo de documentación

```
orden en lenguaje natural
        |
agente: búsqueda + extracción de fuentes
        |
escribe  wiki/<categoria>/<tema>.md  (con frontmatter)
        |
regenera índices + compila  (rebuild.sh)
        |
verifica respuesta HTTP
        |
commit descriptivo
        |
publicación en el sitio
```

Detalle, incluido lo que falta, en `FLUJO-DOCUMENTACION.md`.

## Flujo de respaldo

```
cron diario (previsto)
        |
script de respaldo
        |
sincroniza wiki + configuración seleccionada
        |
git add / commit / push  →  repositorio privado
```

En la verificación del 2026-11-16 el script y el cron **no existían** y el
último commit de respaldo era del 2026-10-06. El flujo queda documentado como
diseño, no como automatización activa.

## Decisiones de diseño

| Decisión | Razón |
|----------|-------|
| VitePress | Compilación rápida, Markdown simple, búsqueda local |
| Red de malla privada | Funciona detrás de NAT sin configurar firewall |
| Perfiles de agente separados | Aíslan contexto y reglas por tarea |
| Respaldo sin LLM (`--no-agent`) | Un respaldo no debe depender del modelo ni de su cuota |
| Índices generados por script | Evita enlaces muertos al añadir páginas |
| Credenciales fuera del repositorio | El respaldo nunca contiene secretos |

## Puertos y servicios

Se omiten deliberadamente las direcciones concretas. En la práctica: un puerto
HTTP para el sitio de la wiki, uno para el gateway del agente, uno local para
el navegador de automatización y el 22 restringido a la malla.
