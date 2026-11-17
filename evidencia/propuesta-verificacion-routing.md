# Propuesta de cambio: verificación de rutas en RouterOS 7

Demostración real del ciclo **propuesta → compilación → revisión**, pendiente de
aprobación. Ninguna parte de este cambio está fusionada a `main`.

## Qué se propone

Añadir a `site/wiki/mikrotik/routing.md` una sección corta, **Verificación antes
de publicar**, con tres comandos de comprobación, un criterio de diagnóstico y un
aviso honesto: los ejemplos de BGP de la página usan sintaxis anterior a
RouterOS 7 y no están verificados.

Motivo editorial: la página acumula ~40 secciones de una línea ("Route bond",
"Route teaming", "Route convergence"…) sin comandos ni criterio de comprobación.
La propuesta no reescribe ese relleno todavía; solo añade lo mínimo para que
quien use la página pueda confirmar el estado del equipo antes de aplicar algo.

## Dónde está

| Dato | Valor |
|------|-------|
| Rama | `propuesta/verificacion-routing-routeros7` |
| Commit | el HEAD de la rama (`git rev-parse --short propuesta/verificacion-routing-routeros7`); el hash cambia si la rama se rebasa |
| Archivos tocados | 1: `site/wiki/mikrotik/routing.md` (+19 −1) |
| Estado | **Pendiente de revisión**, sin fusionar |

## El diff

````diff
--- a/site/wiki/mikrotik/routing.md
+++ b/site/wiki/mikrotik/routing.md
@@ -2,7 +2,7 @@
 title: "Routing MikroTik"
 tags: [mikrotik]
 created: 2026-10-05
-updated: 2026-10-05
+updated: 2026-11-16
 sources: ["https://manual.mikrotik.com/docs/routeros/routing/"]
 ---
@@ -162,6 +162,24 @@ Configura rutas estáticas, RIPv2, OSPF y BGP.
 ## Route topology
 - Visualize network topology.
 
+## Verificación antes de publicar
+
+Antes de documentar un cambio de enrutamiento, confirma el estado real en el
+equipo:
+
+```bash
+/routing/route/print where active=yes
+/ip/route/print detail
+/routing/table/print
+```
+
+- La tabla activa debe mostrar la ruta esperada con su gateway y su distancia.
+- Si la ruta no aparece como activa, el problema suele estar en el gateway o en
+  la interfaz, no en la regla de firewall.
+- En RouterOS 7 la configuración de BGP vive bajo `/routing/bgp`. Los ejemplos
+  de BGP de esta página usan sintaxis de versiones anteriores y quedan
+  **pendientes de verificar** antes de aplicarlos en producción.
+
 ## Enlaces
````

Copia exacta en `propuesta-routing.diff`.

## Comprobación de que compila

Compilado **desde la rama**, no desde `main`:

```
$ npx vitepress build
vitepress v1.6.4
✓ building client + server bundles...
✓ rendering pages...
build complete in 2.70s.
# 6 HTML generados

$ npx vitepress preview --port 8101
/                       -> 200      /wiki/pfsense/vlans     -> 200
/guia/flujo-de-cambios  -> 200      /wiki/hermes/agentes-ia -> 200
/wiki/mikrotik/routing  -> 200

# ancla presente en el HTML compilado:
id="verificacion-antes-de-publicar"
```

Salida completa en `build-propuesta.log` y `propuesta-http-check.txt`.
Captura de cómo se ve: `demo-propuesta-routing.png`.

## Cómo revisarlo en local

```bash
cd ~/Proyectos/hermes-public-work/hermes-infrastructure
git diff main propuesta/verificacion-routing-routeros7
git switch propuesta/verificacion-routing-routeros7
cd site && npm install && npx vitepress dev     # http://localhost:5173/wiki/mikrotik/routing
```

Para volver al estado publicado en borrador: `git switch main`.

## Checklist de revisión

| Criterio | Resultado |
|----------|-----------|
| Frontmatter completo e `updated` correcto | Sí (2026-11-16) |
| Una sola página tocada | Sí |
| Compila y la ruta responde 200 | Sí |
| Sin credenciales, IP internas ni datos personales | Sí (IPs de ejemplo `192.168.1.0/24`, `10.0.0.0/24`) |
| Fuentes: se mantiene el manual oficial de MikroTik | Sí |
| Contenido técnico verificado contra el equipo real | **No**: los comandos son de la documentación de RouterOS 7; no se ejecutaron en un router del laboratorio |

Ese último punto es la decisión de revisión: se puede publicar como
"procedimiento de comprobación" citando el manual, o dejarlo pendiente hasta
probarlo en un equipo.

## Si se aprueba

```bash
git switch main
git merge --ff-only propuesta/verificacion-routing-routeros7
cd site && npx vitepress build
```

Después de fusionar, el borrador deja de tener una rama abierta y la evidencia
de esta carpeta pasa a ser histórica.
