---
title: "Configuración de VLANs en pfSense"
tags: [pfsense, redes, vlan, "802.1Q", firewall]
created: 2026-10-05
updated: 2026-10-05
sources:
  - https://docs.netgate.com/pfsense/en/latest/vlan/configuration.html
  - https://docs.netgate.com/pfsense/en/latest/recipes/switch-vlan-configuration.html
  - https://docs.netgate.com/pfsense/en/latest/solutions/netgate-2100/configuring-the-switch-ports.html
confidence: alta
---

# VLANs en pfSense

> **TL;DR**: Las VLANs permiten segmentar una red física en múltiples redes lógicas independientes. En pfSense, se configuran mediante la interfaz gráfica (GUI) o CLI, asignando una etiqueta (VID) a trunks y puertos de acceso. Requiere configuración en el switch (trunk, PVID) y reglas de firewall para permitir tráfico entre VLANs.

## 📖 Definición y contexto

Una **VLAN (Virtual Local Area Network)** es una segmentación lógica de una red física que permite dividir un único switch o segmento de red en múltiples redes independientes. Las VLANs se basan en el estándar **802.1Q**, que define cómo etiquetar los paquetes de red con un **VID (VLAN Identifier)** y un **TPID (Tag Protocol Identifier)**.

### 🔹 Conceptos clave
- **802.1Q**: Estándar que define el formato de etiquetado de paquetes para VLANs.
- **C-Tag (0x8100)**: Etiqueta interna para VLANs simples (la mayoría de los casos).
- **S-Tag (0x88a8)**: Etiqueta externa para **QinQ** (doble etiquetado).
- **VID**: Identificador numérico de la VLAN (rango: 1-4094).
- **PVID (Port VLAN ID)**: VLAN predeterminada para un puerto de acceso.
- **Trunk**: Puerto que transmite múltiples VLANs etiquetadas.
- **Access Port**: Puerto que transmite una sola VLAN (sin etiqueta).

### 🔹 ¿Por qué usar VLANs?
- **Seguridad**: Aislar dispositivos sensibles (ej: DMZ).
- **Rendimiento**: Reducir tráfico en la red física.
- **Organización**: Separar departamentos o tipos de tráfico (ej: VoIP, datos).
- **Escalabilidad**: Facilitar la gestión de redes grandes.

---

## 🎯 Cómo funciona una VLAN

### 🔹 Arquitectura
1. **Switch**: Reenvía paquetes según la etiqueta VLAN.
2. **pfSense**: Asigna interfaces virtuales (ej: `VLAN10`) y configura reglas de firewall.
3. **Trunk**: Conecta pfSense al switch y transmite múltiples VLANs etiquetadas.
4. **Access Ports**: Conectan dispositivos finales (PC, servidores) a una VLAN específica.

### 🔹 Flujo de paquetes
1. Un dispositivo envía un paquete con una etiqueta VLAN (ej: VID=10).
2. El switch reenvía el paquete al puerto de destino según la etiqueta.
3. pfSense recibe el tráfico en la interfaz asignada (ej: `OPT1` para VLAN10).

---

## 💻 Configuración de VLANs en pfSense

### 🔹 Paso a paso en la GUI

#### 1. Crear una VLAN
- Navega a **Interfaces > Assignments** > **VLANs** tab.
- Haz clic en **Add** para crear una nueva VLAN.
- Configura los siguientes campos:
  - **Parent Interface**: Interfaz física (ej: `igc1`).
  - **VLAN Tag Type**: Selecciona **C-Tag (0x8100)** para VLANs simples.
  - **VLAN Tag**: Asigna un VID (ej: `10`).
  - **VLAN Priority**: Opcional (0-7).
  - **Description**: Ej: `DMZ` o `Phones`.
- Haz clic en **Save**.

#### 2. Asignar la VLAN como interfaz
- Ve a **Interfaces > Assignments** > **Interface Assignments** tab.
- Selecciona la VLAN creada (ej: `VLAN 10 on igc1`) de la lista **Available Network Ports**.
- Haz clic en **Add** para asignarla.
- Configura la interfaz virtual:
  - **Enable Interface**: Marca esta opción.
  - **IPv4 Configuration Type**: Elige **Static IPv4** o **DHCP**.
  - Asigna una dirección IP (ej: `192.168.10.1/24`).
- Haz clic en **Save** y luego en **Apply Changes**.

#### 3. Configurar DHCP (opcional)
- Ve a **Services > DHCP Server** > **OPT1** tab (o la interfaz asignada).
- Activa el servidor DHCP y configura el rango de direcciones.

#### 4. Configurar reglas de firewall
- Ve a **Firewall > Rules** > **OPT1** tab.
- Crea reglas para permitir tráfico entre VLANs o hacia WAN.
  Ejemplo:
  ```
  Action: Pass
  Interface: OPT1
  Protocol: TCP/UDP
  Source/Destination: Permitir direcciones específicas
  ```

---

## 🔧 Configuración del switch

### 🔹 Configuración genérica
1. **Definir VLANs**: Crea las VLANs en el switch (ej: VLAN 10, VLAN 20).
2. **Configurar puerto trunk**:
   - Conecta pfSense al switch.
   - Configura el puerto como **trunk** y habilita **802.1Q tagging**.
   Ejemplo en Cisco:
   ```
   sw(config)# interface GigabitEthernet0/1
   sw(config-if)# switchport mode trunk
   sw(config-if)# switchport trunk encapsulation dot1q
   sw(config-if)# switchport trunk allowed vlan 10,20
   ```
3. **Configurar puertos de acceso**:
   - Asigna puertos a VLANs específicas.
   - Configura el **PVID** si es necesario.
   Ejemplo:
   ```
   sw(config)# interface GigabitEthernet0/2
   sw(config-if)# switchport mode access
   sw(config-if)# switchport access vlan 10
   ```

### 🔹 Configuración en Netgate 2100
1. En pfSense, habilita **802.1q VLAN mode** en **Interfaces > Switches > VLANs**.
2. Añade una etiqueta VLAN (ej: `4084`) y asigna los miembros (puertos).
3. Configura el **Port VID** para cada puerto.

---

## 📊 Ejemplos prácticos

### 🔹 Ejemplo 1: Segmentación DMZ
- **Objetivo**: Aislar un servidor web en una VLAN separada.
- **Pasos**:
  1. Crea una VLAN con VID=10 y descripción `DMZ`.
  2. Asigna la interfaz `OPT1` con IP `192.168.10.1/24`.
  3. Configura el servidor web con IP `192.168.10.100`.
  4. Crea reglas de firewall para permitir tráfico HTTP/HTTPS desde LAN a DMZ.

### 🔹 Ejemplo 2: VoIP y datos separados
- **Objetivo**: Separar tráfico de voz (VoIP) de datos.
- **Pasos**:
  1. Crea dos VLANs: VID=20 (`VoIP`) y VID=30 (`Datos`).
  2. Asigna puertos de acceso en el switch:
     - Puertos 1-5: VLAN 20 (VoIP).
     - Puertos 6-10: VLAN 30 (Datos).
  3. Configura QoS en pfSense para priorizar tráfico VoIP.

### 🔹 Ejemplo 3: Red educativa con múltiples aulas
- **Objetivo**: Crear VLANs por aula (ej: Aula1, Aula2).
- **Pasos**:
  1. Crea VLANs con VID=50 (`Aula1`) y VID=60 (`Aula2`).
  2. Asigna puertos de acceso en el switch a cada VLAN.
  3. Configura DHCP en pfSense para cada VLAN con rangos separados.

---

## ⚠️ Troubleshooting

| **Error**                          | **Causa**                                  | **Solución**                                                                 |
|------------------------------------|------------------------------------------|------------------------------------------------------------------------------|
| Sin conexión en VLAN asignada     | Interfaz no habilitada o IP incorrecta | Verifica **Enable Interface** y asigna una IP válida.                       |
| Tráfico bloqueado entre VLANs     | Falta regla de firewall                  | Crea reglas en **Firewall > Rules** para permitir tráfico entre VLANs.      |
| Paquetes etiquetados incorrectos   | Configuración errónea del trunk           | Verifica que el puerto trunk tenga las VLANs correctas en `switchport trunk allowed vlan`. |
| DHCP no funciona en VLAN           | Servidor DHCP no configurado               | Activa DHCP en **Services > DHCP Server** para la interfaz VLAN.             |
| Conexión intermitente              | Conflicto de VID                          | Asegúrate de que los VIDs sean únicos y no superen 4094.                   |
| Switch no reconoce VLAN            | VLAN no definida en el switch            | Define las VLANs en el switch antes de asignarlas en pfSense.              |

---

## 🔗 Ver también
- [[pfSense Firewall]]
- [[pfSense Interfaces]]
- [[Configuración de Switches]]

---

## 📚 Fuentes oficiales
- [Configuración de VLANs en pfSense](https://docs.netgate.com/pfsense/en/latest/vlan/configuration.html)
- [Configuración de Switches con VLANs](https://docs.netgate.com/pfsense/en/latest/recipes/switch-vlan-configuration.html)
- [Configuración de puertos en Netgate 2100](https://docs.netgate.com/pfsense/en/latest/solutions/netgate-2100/configuring-the-switch-ports.html)