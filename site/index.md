---
layout: home

hero:
  name: Hermes Infrastructure
  text: Demo de la wiki técnica
  tagline: Tres páginas seleccionadas y el flujo real de cambio, revisión y publicación
  actions:
    - theme: brand
      text: Ver el flujo de cambios
      link: /guia/flujo-de-cambios
    - theme: alt
      text: Páginas de ejemplo
      link: /wiki/mikrotik/routing

features:
  - title: Documentación con fuentes
    details: Cada página lleva frontmatter con título, etiquetas, fechas, fuentes y nivel de confianza.
  - title: Índices generados
    details: rebuild.sh regenera los índices de categoría y la portada antes de compilar.
  - title: Publicación verificada
    details: La compilación falla si no se genera el artefacto; el commit es el último paso.
---

## Qué es esta demo

Es una porción pública de una wiki privada de redes y sistemas, compilada con
VitePress. Se eligieron tres páginas que representan el tipo de contenido y la
variedad de calidad del material original:

| Página | Qué muestra |
|--------|-------------|
| [Routing MikroTik](/wiki/mikrotik/routing) | Configuración de routing con comandos y fuentes |
| [VLANs en pfSense](/wiki/pfsense/vlans) | Segmentación 802.1Q: concepto, GUI y switch |
| [Agentes de IA autónomos](/wiki/hermes/agentes-ia) | Documentación de tendencias con fuentes citadas |

La guía [Flujo de cambios](/guia/flujo-de-cambios) explica cómo el agente
propone un cambio, cómo se revisa y cómo se publica, incluidas las etapas que
todavía no están implementadas.

::: warning Alcance
Esta demo no incluye credenciales, configuración del agente ni direcciones
internas. El repositorio privado de origen y su historial no se modificaron.
:::
