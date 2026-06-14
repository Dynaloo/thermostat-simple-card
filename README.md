# 🌡️ Adaptive Custom Thermostat (Heater & AC)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration) ![Version](https://img.shields.io/github/v/release/dynaloo/thermostat-card?label=version&color=blue&maxAge=3600) ![Downloads](https://badgen.net/github/assets-dl/dynaloo/thermostat-card?label=Downloads&color=blue) [![Home Assistant Community Forum](https://img.shields.io/badge/Home%20Assistant-Community%20Forum-blue?logo=home-assistant)](https://community.home-assistant.io/t/simple-swipe-card-a-custom-card-for-easy-card-navigation/888415)

A universal, modern, and ultra-responsive Home Assistant (Lovelace) card to control your **conventional heating (pilot wire)** or **air conditioning (AC)** devices (tested with Mitsubishi Melcloud integration). Inspired by the sleek design of *Mushroom*, it consolidates all your essential controls in a minimal footprint.

---

## ✨ Features

* 🔄 **Dual Interface :**
  * Adapts automatically according to the device type chosen (Heating with presets or Air conditioning with complex modes).
* 🎛️ **Advanced AC Controls :**
  * Integrated management of ventilation speed (`fan_mode`) and oscillation of horizontal/vertical shutters (`swing_mode`).
* 🎨 **Clear State Indicators :** 
  * Black icon background when the device is active, solid grey when it is (`off`).
  * Presets (heating) are hidden when the thermostat is turned (`off`).
  * The +/- temperature setting is inactive when the thermostat is switched (`off`).
  * A color pulse badge (orange for heating, blue for air conditioning) indicates the actual activity. (`hvac_action`).
* 🐭 **Contextual Tooltips :**
  * Hovering the mouse over the buttons displays detailed information about the action or current state of the probe.
* 🛠️ **Integrated Visual Editor :**
  * Quick and easy setup with the native form `ha-form`.

---

## 🚀 Installation

### HACS (Recommended)
[![Add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=dynaloo&repository=thermostat-card&category=Plugin)

### HACS (Manual)
1. Open HACS
2. Click on the three dots in the top right corner
3. Select "Custom repositories"
4. Add this repository URL : `https://github.com/dynaloo/thermostat-card`
5. Click "Add"
6. Click on reload
7. Search for "thermostat-card" and install it

### Manual Installation
1. Download `thermostat-card` from the latest release or from the `/build` folder in the main repository
2. Copy it to `config/www/thermostat-card/thermostat-card.js`
3. Add the following to your configuration.yaml:
   ```yaml
   lovelace:
     resources:
       - url: /local/thermostat-card/thermostat-card.js
         type: JavaScript Module
   ```
4. Restart Home Assistant

---

## 🛠️ Example configuration

Thermostat-Card includes a visual editor that appears when you add or edit the card through the Home Assistant UI.

or simply add this block to your dashboard in YAML mode :

```yaml
type: custom:thermostat-card
device_type: heater
entity: climate.thermostat_living_room
title: Thermostat Living room
current_temp_sensor: sensor.temperature_living_room
```


| Option | Type | Requis | Par défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `device_type` | string | **yes** | - | Must be: `heater or ac`. |
| `type` | string | **yes** | - | Must be: `custom:thermostat-card`. |
| `entity` | string | **yes** | - | Your heating or air conditioning entity (ex: `climate.thermostat_living_room`). |
| `title` | string | No | - | Custom title displayed at the top of the map (ex: `Living Room Thermostat`). |
| `current_temp_sensor` | string | No | - | Ambiante temperature sensor (ex: `sensor.temperature_living_room`). |

---

## 📸 Screenshot

<div style="text-align: center;">
  <p style="font-style: italic; color: gray; margin-top: 8px;">Preview: Thermostat heating in "<b>off</b>" mode</p>
  <img src="https://raw.githubusercontent.com/dynaloo/thermostat-card/main/images/Capture-1.png" alt="Aperçu du Thermostat>" width="400" style="display: block; margin: 0 auto;">
</div>

<div style="text-align: center;">
  <p style="font-style: italic; color: gray; margin-top: 8px;">Preview: Thermostat heating in "<b>on</b>" mode</p>
  <img src="https://raw.githubusercontent.com/dynaloo/thermostat-card/main/images/Capture-2.png" alt="Aperçu du Thermostat" width="400" style="display: block; margin: 0 auto;">
</div>

<div style="text-align: center;">
  <p style="font-style: italic; color: gray; margin-top: 8px;">Preview: Thermostat heating in "<b>on</b>" mode and "<b>Active</b>" (flashing red dot displayed on the icon)</p>
  <img src="https://raw.githubusercontent.com/dynaloo/thermostat-card/main/images/Capture-3.png" alt="Aperçu du Thermostat" width="400" style="display: block; margin: 0 auto;">
</div>

<div style="text-align: center;">
  <p style="font-style: italic; color: gray; margin-top: 8px;">Preview: Air conditioner thermostat in "<b>off</b>" mode</p>
  <img src="https://raw.githubusercontent.com/dynaloo/thermostat-card/main/images/Capture-4.png" alt="Aperçu du Thermostat>" width="400" style="display: block; margin: 0 auto;">
</div>

<div style="text-align: center;">
  <p style="font-style: italic; color: gray; margin-top: 8px;">Preview: Air conditioner thermostat in "<b>Fan only</b>" mode</p>
  <img src="https://raw.githubusercontent.com/dynaloo/thermostat-card/main/images/Capture-5.png" alt="Aperçu du Thermostat>" width="400" style="display: block; margin: 0 auto;">
</div>
---

🤝 Contribute! Suggestions and bug reports are welcome! Feel free to open an issue or submit a pull request to the repository.
