# Alcance, exclusiones y criterio de depuración

## Origen

Fuente: repositorio privado `kylandr/hermes-backup`, clonado **solo lectura** en
un directorio nuevo. No se hizo `push`, no se reescribió su historial y no se
modificó el original (último commit `16452b1`, 2026-10-06 03:34 UTC).

## Qué se incluyó

- README nuevo, escrito para esta versión.
- Documentos de arquitectura y flujo, derivados del material privado y
  reescritos sin direcciones ni nombres internos.
- Informe del servidor MCP de Google Flow.
- Demo local de la wiki: 3 páginas seleccionadas + guía del flujo de cambios.
- Evidencia de compilación y de pruebas.

## Qué se excluyó y por qué

| Excluido | Motivo |
|----------|--------|
| `.env`, `auth.json`, `config.yaml`, claves, tokens | Credenciales |
| Configuración real del agente (perfiles, memorias, cron, `SOUL.md`) | Datos operativos y personales; además expone rutas y cuentas |
| `hermes/skills/**` (≈300 archivos) | Contenido de terceros (habilidades incluidas con Hermes Agent), no aporte propio |
| Direcciones de la malla privada, IP del VPS, nombres de host, número de WhatsApp, correos | Direcciones internas y datos personales |
| Registros de ejecución, capturas de operación, `screenshots-debug/` | Pueden contener correos, nombres de proyectos y contenido de la cuenta |
| Código del MCP de Google Flow | Proyecto de terceros con licencia MIT; se documenta, no se copia |
| `node_modules/`, `dist/`, cachés, PDF | Regenerables o pesados |
| Páginas de la wiki no seleccionadas | La demo usa 3; el resto vive en el repositorio privado |

## Criterio aplicado a las direcciones

- **Eliminadas**: IP de la malla privada, IP pública/privada del VPS, nombres de
  host, puertos de administración, rutas absolutas con nombre de usuario.
- **Conservadas**: direcciones de ejemplo de RFC 1918 (`192.168.1.0/24`,
  `10.0.0.0/24`) en las páginas de laboratorio, porque son direcciones genéricas
  de ejemplo que no identifican infraestructura real y son necesarias para que
  los ejemplos sean legibles.
- **Sustituidas**: `http://<vps>:8080`, `<categoría>`, `<tema>`.

## Datos personales

El nombre y el título del autor se conservan porque son la autoría del trabajo:
**Stiven Polania, aprendiz del Tecnólogo en Gestión de Redes de Datos del
SENA**. Se eliminaron teléfono, correo y cuentas.

## Estado de la licencia

El proyecto privado declaraba "Privado. Solo para uso personal." Publicar exige
una decisión explícita que **no se tomó en este borrador**:

- Opción A: MIT para el texto y la configuración propios.
- Opción B: CC BY 4.0 para la documentación y MIT para los scripts.
- Opción C: sin licencia (todos los derechos reservados), lo que técnicamente
  permite ver el repositorio pero no reutilizarlo.

Mientras no se elija, este borrador **no** incluye archivo `LICENSE`.

## Riesgos residuales antes de publicar

1. Las páginas de la demo fueron redactadas por el agente a partir de fuentes
   públicas; conviene revisar que no queden marcas de terceros sin atribución.
2. El informe del MCP nombra repositorios y autores de terceros: es correcto,
   pero hay que confirmar que la licencia MIT del original se respeta si algún
   día se publica el fork.
3. El historial nuevo no contiene fechas del proyecto original: las fechas de
   los hitos se citan con su commit de origen y se verifican contra el respaldo.
