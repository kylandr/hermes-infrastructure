---
title: "Routing MikroTik"
tags: [mikrotik]
created: 2026-10-05
updated: 2026-11-16
sources: ["https://manual.mikrotik.com/docs/routeros/routing/"]
---

# Routing MikroTik

## TL;DR
Configura rutas estáticas, RIPv2, OSPF y BGP.

## Rutas estáticas
```bash
/ip route add dst-address=10.0.0.0/24 gateway=192.168.1.1
```

## RIPv2
```bash
/rip enable
/rip network add address=192.168.1.0/24
```

## OSPF
```bash
/ospf instance set default router-id=192.168.1.1
/ospf interface add interface=ether1 advertise-nets=192.168.1.0/24
```

## BGP
```bash
/opt bgp instance set instance=0 router-id=192.168.1.1
/opt bgp neighbor add remote-address=203.0.113.1 remote-as=65001
```

## Policy routing
- `/routing rule add dst-address=0.0.0.0/0 gateway=192.168.1.2 rule-id=1`.
- `/routing rule print`.

## Route balancing
- `/routing fib add dst-address=0.0.0.0/0 gateway=192.168.1.1,192.168.1.2 src-address=0.0.0.0/0 protocol=bgp balancing=2`.

## Route filtering
- `add chain=ospf_in prefix-list=deny_private action=reject comment="Deny private"`.

## Route redistribution
- `add chain=redistribute_in route-type=static action=accept`.

## Route tagging
- `add chain=export tag=100 action=accept`.

## Route targeting
- `add chain=target match=10.0.0.0/24 action=accept`.

## Route selection
- Prefer path with lowest distance.
- Use `route distance` parameter.

## Route metric
- Set metric via `metric` option.

## Route distance
- Distance indicates path preference.

## Route priority
- Priority influences selection order.

## Route scope
- Scope defines validity range.

## Route table
- `/routing table print`.

## Route propagation
- Propagate routes via OSPF/BGP.

## Route reflection
- Use route reflector in BGP.

## Route aggregation
- Aggregate routes to reduce table size.

## Route summarization
- Summarize subnets into single entry.

## Route filtering advanced
- Apply prefix-lists and route-maps.

## Route policy
- Define policies for route manipulation.

## Route map
- Use route-maps for complex conditions.

## Route tag management
- Tag routes for identification.

## Route target handling
- Apply route targets for export/import.

## Route community
- Add communities to routes.

## Route extended community
- Use extended communities for advanced policies.

## Route large community
- Utilize large communities for scale.

## Route next hop
- Set next hop for specific routes.

## Route path
- Trace path using `mtr` or `traceroute`.

## Route AS path
- Analyze AS path in BGP.

## Route origin
- Identify route origin attributes.

## Route local preference
- Set local pref for path selection.

## Route MED
- Use MED for path comparison.

## Route weight
- Adjust weight for Cisco compatibility.

## Route preferential path
- Mark preferred paths.

## Route best path
- Select best path algorithm.

## Route equal cost
- Enable ECMP for load balancing.

## Route load balancing
- Distribute traffic across multiple paths.

## Route failover
- Configure failover paths.

## Route redundancy
- Ensure redundant paths.

## Route link aggregation
- Aggregate links for bandwidth.

## Route bond
- Bond interfaces for redundancy.

## Route teaming
- Team interfaces for load balancing.

## Route convergence
- Monitor convergence time.

## Route topology
- Visualize network topology.

## Verificación antes de publicar

Antes de documentar un cambio de enrutamiento, confirma el estado real en el
equipo:

```bash
/routing/route/print where active=yes
/ip/route/print detail
/routing/table/print
```

- La tabla activa debe mostrar la ruta esperada con su gateway y su distancia.
- Si la ruta no aparece como activa, el problema suele estar en el gateway o en
  la interfaz, no en la regla de firewall.
- En RouterOS 7 la configuración de BGP vive bajo `/routing/bgp`. Los ejemplos
  de BGP de esta página usan sintaxis de versiones anteriores y quedan
  **pendientes de verificar** antes de aplicarlos en producción.

## Enlaces
- [Routing Guide](https://manual.mikrotik.com/docs/routeros/routing/)
- [BGP Overview](https://help.mikrotik.com/docs/bgp/)

## Próximos pasos
VPN y QoS.
