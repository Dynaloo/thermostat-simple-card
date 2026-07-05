import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";
import "./thermostat-simple-card-editor.js"; 
import { cardStyles } from "./styles.js"; 
import { TRANSLATIONS } from "./translations.js"; 

class ThermostatSimpleCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static getConfigElement() {
    return document.createElement("thermostat-simple-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Thermostat",
      device_type: "heater",
      entity: "",
      current_temp_sensor: ""
    };
  }

  setConfig(config) {
    if (!config.entity) {
      console.warn("Thermostat Simple Card: L'attribut 'entity' est manquant.");
    }
    this.config = config;
  }

  static get styles() {
    return cardStyles;
  }

  render() {
    if (!this.hass || !this.config) return html``;

    // Détection de la langue de l'utilisateur (fallback sur 'fr')
    const lang = this.hass.language || "fr";
    const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

    const entityId = this.config.entity;
    const deviceType = this.config.device_type || "heater";
    
    if (!entityId) {
      return html`
        <ha-card header="${this.config.title || 'Thermostat'}">
          <div style="padding: 16px; color: var(--secondary-text-color); font-style: italic;">
            ${t.select_entity}
          </div>
        </ha-card>
      `;
    }

    const stateObj = this.hass.states[entityId];
    if (!stateObj) {
      return html`
        <ha-card>
          <div style="padding: 16px; color: var(--error-color, red); font-weight: bold;">
            ${t.entity_not_found} ${entityId}
          </div>
        </ha-card>
      `;
    }

    const mode = stateObj.state ?? "unknown";
    const attributes = stateObj.attributes ?? {};
    
    const preset = attributes.preset_mode ?? "none";
    const fanMode = attributes.fan_mode ?? "auto";
    const swingMode = attributes.swing_mode ?? "off";
    const swingHorizontalMode = attributes.swing_horizontal_mode ?? "off";
    
    const fanModes = attributes.fan_modes ?? ["auto", "low", "medium", "high"];
    const swingModes = attributes.swing_modes ?? ["off", "vertical", "horizontal", "both"];
    const swingHorizontalModes = attributes.swing_horizontal_modes ?? ["off", "horizontal"];
    const presetModes = attributes.preset_modes ?? [];
    const hvacModes = attributes.hvac_modes ?? [];

    const isHeating = attributes.hvac_action === "heating";
    const isCooling = attributes.hvac_action === "cooling";

    let currentRoomTemp = null;
    if (this.config.current_temp_sensor && this.hass.states[this.config.current_temp_sensor]) {
      currentRoomTemp = this.hass.states[this.config.current_temp_sensor].state;
    }

    // Initialisation des variables graphiques par défaut
    let mainIcon = "mdi:thermostat";
    let mainIconColor = "rgba(255, 255, 0, 1)";
    let shapeColor = "rgba(255, 255, 255, 0.05)"; 
    let badgeHtml = html``;
    let isMainIconFan = false;
    let mainIconTooltip = "";

    // CONFIGURATION VISUELLE : BRANCHE CLIMATISATION (AC)
    if (deviceType === "ac") {
      if (mode === "off" || mode === "unknown") {
        shapeColor = "rgba(128, 128, 128, 0.1)"; 
        mainIcon = mode === "unknown" ? "mdi:cloud-off-outline" : "mdi:power";
        mainIconColor = "rgba(255, 255, 255, 0.5)";
        mainIconTooltip = mode === "unknown" ? t.unknown_status : t.device_off;
      } else {
        switch (mode) {
          case "heat":
            mainIcon = "mdi:fire";
            mainIconColor = "rgba(255, 100, 0, 1)";
            mainIconTooltip = `Mode : ${t.modes.heat}`;
            break;
          case "cool":
            mainIcon = "mdi:snowflake";
            mainIconColor = "rgba(0, 191, 255, 1)";
            mainIconTooltip = `Mode : ${t.modes.cool}`;
            break;
          case "fan_only":
            mainIcon = "mdi:fan";
            mainIconColor = "rgba(0, 255, 0, 1)";
            isMainIconFan = true;
            mainIconTooltip = `Mode : ${t.modes.fan_only}`;
            break;
          case "dry":
            mainIcon = "mdi:water-percent";
            mainIconColor = "rgba(0, 128, 128, 1)";
            mainIconTooltip = `Mode : ${t.modes.dry}`;
            break;
          case "heat_cool":
            mainIcon = "mdi:autorenew";
            mainIconColor = "rgba(202, 206, 0, 1)";
            mainIconTooltip = `Mode : ${t.modes.heat_cool}`;
            break;
          default:
            mainIconTooltip = `Mode : ${mode}`;
            break;
        }
      }
      
      if (isCooling) {
        badgeHtml = html`<div class="cooling-badge" title="${t.cooling_active} : ${t.cooling_in_progress}"></div>`;
        mainIconTooltip += ` (${t.cooling_in_progress})`;
      }
      if (isHeating) {
        badgeHtml = html`<div class="heating-badge" title="${t.heating_active} : ${t.heating_in_progress}"></div>`;
        mainIconTooltip += ` (${t.heating_in_progress})`;
      }

    // CONFIGURATION VISUELLE : BRANCHE CHAUFFAGE (HEATER)
    } else {
      if (mode === "off" || mode === "unknown") {
        shapeColor = "rgba(128, 128, 128, 0.1)"; 
        mainIcon = mode === "unknown" ? "mdi:cloud-off-outline" : "mdi:radiator-off"; 
        mainIconColor = mode === "unknown" ? "rgba(255, 255, 255, 0.5)" : "rgba(128, 128, 128, 1)"; 
        mainIconTooltip = mode === "unknown" ? t.unknown_status : t.device_off;
      } else {
        mainIcon = "mdi:radiator"; 
        switch (preset) {
          case "comfort": mainIconColor = "rgba(255, 165, 0, 1)"; mainIconTooltip = `Preset : ${t.presets.comfort}`; break;
          case "eco":     mainIconColor = "rgba(0, 128, 0, 1)";   mainIconTooltip = `Preset : ${t.presets.eco}`; break;
          case "frost":   mainIconColor = "rgba(0, 191, 255, 1)"; mainIconTooltip = `Preset : ${t.presets.frost}`; break;
          case "boost":   mainIconColor = "rgba(255, 0, 0, 1)";   mainIconTooltip = `Preset : ${t.presets.boost}`; break;
          case "none": 
          default:        mainIconColor = "rgba(255, 255, 0, 1)"; mainIconTooltip = `Mode : ${t.presets.none}`; break;
        }
      }
      
      if (isHeating) {
        badgeHtml = html`<ha-icon icon="mdi:fire" class="heating-badge" title="${t.heating_active} : ${t.heating_in_progress}"></ha-icon>`;
        mainIconTooltip += ` (${t.heating_in_progress})`;
      }
    }

    const targetTemp = attributes.temperature ?? attributes.target_temp_low ?? null;
    const displayTemp = targetTemp !== null ? `${targetTemp}°C` : '--°C';

    return html`
      <ha-card .header="${this.config.title || ''}">
        <div class="card-container">
          
          <div class="buttons1">
            <div class="mushroom-container">
              <div class="icon-wrapper" title="${mainIconTooltip}">
                <div class="shape" style="background-color: ${shapeColor};">
                  <ha-icon .icon="${mainIcon}" class="${isMainIconFan ? 'spin-animation' : ''}" style="color: ${mainIconColor};"></ha-icon>
                </div>
                ${badgeHtml}
              </div>
              
              ${currentRoomTemp 
                ? html`
                    <div class="ambient-temp-container" title="${t.ambient_temp}">
                      <ha-icon icon="mdi:thermometer"></ha-icon>
                      <span>${currentRoomTemp}°C</span>
                    </div>
                  ` 
                : html`<div style="flex: 1;"></div>`
              }
              
              <div class="controls">
                <button class="btn-inc-dec" title="${t.decrease_target}" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, -1)}"><ha-icon icon="mdi:minus"></ha-icon></button>
                <span class="temp-display" title="${t.target_temp_tooltip}">${displayTemp}</span>
                <button class="btn-inc-dec" title="${t.increase_target}" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, 1)}"><ha-icon icon="mdi:plus"></ha-icon></button>
              </div>
            </div>
          </div>

          ${deviceType === "heater" 
            ? html`
                <div class="buttons2">
                  <button class="btn ${mode === 'heat' ? 'active-heat' : ''}" title="${t.turn_on_heater}" @click="${() => this._setHvacMode('heat')}">
                    <ha-icon icon="mdi:fire" class="${mode === 'heat' ? 'blink' : ''}" style="color: ${mode === 'heat' ? 'rgba(255, 0, 0, 1)' : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                    <span>on</span>
                  </button>
                  <button class="btn ${mode === 'off' ? 'active-off' : ''}" title="${t.turn_off_heater}" @click="${() => this._setHvacMode('off')}">
                    <ha-icon icon="mdi:power" style="color: ${mode === 'off' ? 'rgba(255, 255, 255, 1)' : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                    <span>off</span>
                  </button>
                </div>
              `
            : html``
          }

          ${(deviceType === "heater" && mode !== "off" && mode !== "unknown") || deviceType === "ac"
            ? html`
                <div class="buttons3">
                  ${deviceType === "heater"
                    ? html`
                        ${presetModes.map((pMode) => {
                          let icon = "mdi:bookmark";
                          let color = "rgba(128, 128, 128, 1)";
                          let label = t.presets[pMode] || pMode;

                          switch (pMode) {
                            case "comfort": icon = "mdi:sofa"; color = "rgba(255, 165, 0, 1)"; break;
                            case "eco": icon = "mdi:leaf"; color = "rgba(0, 128, 0, 1)"; break;
                            case "frost": icon = "mdi:snowflake-thermometer"; color = "rgba(0, 191, 255, 1)"; break;
                            case "boost": icon = "mdi:rocket-launch"; color = "rgba(255, 0, 0, 1)"; break;
                            case "none": icon = "mdi:hand-back-right-outline"; color = "rgba(255, 255, 0, 1)"; break;
                            case "home": icon = "mdi:home"; color = "rgba(33, 150, 243, 1)"; break;
                            case "away": icon = "mdi:walk"; color = "rgba(156, 39, 176, 1)"; break;
                            case "sleep": icon = "mdi:bed"; color = "rgba(63, 81, 181, 1)"; break;
                          }

                          const isActive = preset === pMode;

                          return html`
                            <button class="btn" title="Mode : ${label}" @click="${() => this._setPreset(pMode)}">
                              <ha-icon icon="${icon}" style="color: ${isActive ? color : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                              <span>${label}</span>
                            </button>
                          `;
                        })}
                      `
                    : html`
                        ${hvacModes.map((hMode) => {
                          let icon = "mdi:help-circle-outline";
                          let color = "rgba(128, 128, 128, 1)";
                          let label = hMode;
                          let tooltip = t.modes[hMode] || hMode;
                          let isFan = false;
                          let isBlink = false;

                          switch (hMode) {
                            case "heat": icon = "mdi:fire"; color = "rgba(255, 100, 0, 1)"; label = "Heat"; break;
                            case "cool": icon = "mdi:snowflake"; color = "rgba(0, 191, 255, 1)"; label = "Cool"; isBlink = (mode === "cool"); break;
                            case "fan_only": icon = "mdi:fan"; color = "rgba(0, 255, 0, 1)"; label = "Fan"; isFan = (mode === "fan_only"); break;
                            case "dry": icon = "mdi:water-percent"; color = "rgba(0, 128, 128, 1)"; label = "Dry"; break;
                            case "heat_cool": icon = "mdi:autorenew"; color = "rgba(202, 206, 0, 1)"; label = "Auto"; break;
                            case "off": icon = "mdi:power"; color = "rgba(255, 255, 255, 1)"; label = "Stop"; break;
                          }

                          const isActive = mode === hMode;

                          return html`
                            <button class="btn" title="Mode : ${tooltip}" @click="${() => this._setHvacMode(hMode)}">
                              <ha-icon icon="${icon}" class="${isFan ? 'spin-animation' : ''} ${isBlink ? 'blink' : ''}" style="color: ${isActive ? color : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                              <span>${label}</span>
                            </button>
                          `;
                        })}
                      `
                  }
                </div>
              `
            : html``
          }

          ${deviceType === "ac" && mode !== "off" && mode !== "unknown"
            ? html`
                <div class="ac-advanced-controls">
                  
                  <div class="control-dropdown" title="${t.fan_speed} ${fanMode.toUpperCase()}">
                    <ha-icon icon="mdi:fan-speed-1"></ha-icon>
                    <select @change="${(e) => this._setFanMode(e.target.value)}">
                      ${fanModes.map((fMode) => html`
                        <option value="${fMode}" ?selected="${fanMode === fMode}">${fMode.toUpperCase()}</option>
                      `)}
                    </select>
                  </div>

                  <div class="control-dropdown" title="${t.vertical_swing} ${swingMode.toUpperCase()}">
                    <ha-icon icon="mdi:arrow-up-down-bold"></ha-icon>
                    <select @change="${(e) => this._setSwingMode(e.target.value)}">
                      ${swingModes.map((sMode) => html`
                        <option value="${sMode}" ?selected="${swingMode === sMode}">${sMode.toUpperCase()}</option>
                      `)}
                    </select>
                  </div>

                  <div class="control-dropdown" title="${t.horizontal_swing} ${swingHorizontalMode.toUpperCase()}">
                    <ha-icon icon="mdi:arrow-left-right-bold"></ha-icon>
                    <select @change="${(e) => this._setSwingHorizontalMode(e.target.value)}">
                      ${swingHorizontalModes.map((shMode) => html`
                        <option value="${shMode}" ?selected="${swingHorizontalMode === shMode}">${shMode.toUpperCase()}</option>
                      `)}
                    </select>
                  </div>

                </div>
              `
            : html``
          }

        </div>
      </ha-card>
    `;
  }

  _setHvacMode(mode) {
    if (!this.config?.entity) return;
    this.hass.callService("climate", "set_hvac_mode", { entity_id: this.config.entity, hvac_mode: mode });
  }

  _setPreset(preset) {
    if (!this.config?.entity) return;
    this.hass.callService("climate", "set_preset_mode", { entity_id: this.config.entity, preset_mode: preset });
  }

  _setTemp(stateObj, direction) {
    if (!this.config?.entity) return;
    const currentTemp = parseFloat(stateObj?.attributes?.temperature ?? stateObj?.attributes?.target_temp ?? 20);
    const step = parseFloat(stateObj?.attributes?.target_temp_step ?? 0.5);
    
    if (isNaN(currentTemp)) return;

    this.hass.callService("climate", "set_temperature", { 
      entity_id: this.config.entity, 
      temperature: currentTemp + (direction * step) 
    });
  }

  _setFanMode(fanMode) {
    if (!this.config?.entity) return;
    this.hass.callService("climate", "set_fan_mode", { entity_id: this.config.entity, fan_mode: fanMode });
  }

  _setSwingMode(swingMode) {
    if (!this.config?.entity) return;
    this.hass.callService("climate", "set_swing_mode", { entity_id: this.config.entity, swing_mode: swingMode });
  }

  _setSwingHorizontalMode(swingHorizontalMode) {
    if (!this.config?.entity) return;
    this.hass.callService("climate", "set_swing_horizontal_mode", { 
      entity_id: this.config.entity, 
      swing_horizontal_mode: swingHorizontalMode 
    });
  }
}

customElements.define("thermostat-simple-card", ThermostatSimpleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-simple-card",
  name: "Thermostat Simple Card",
  description: "Carte universelle adaptative sécurisée (Lit 3)",
});
