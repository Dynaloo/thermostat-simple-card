import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";
import "./thermostat-simple-card-editor.js"; 
import { cardStyles } from "./styles.js"; 

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

    const entityId = this.config.entity;
    const deviceType = this.config.device_type || "heater";
    
    if (!entityId) {
      return html`
        <ha-card header="${this.config.title || 'Thermostat'}">
          <div style="padding: 16px; color: var(--secondary-text-color); font-style: italic;">
            Veuillez sélectionner une entité dans l'éditeur visuel.
          </div>
        </ha-card>
      `;
    }

    const stateObj = this.hass.states[entityId];
    if (!stateObj) {
      return html`
        <ha-card><div style="padding: 16px; color: var(--error-color, red); font-weight: bold;">Entité introuvable ou indisponible : ${entityId}</div></ha-card>
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

    let mainIcon = "mdi:thermostat";
    let mainIconColor = "rgba(255, 255, 0, 1)";
    let shapeColor = "rgba(255, 255, 255, 0.05)"; 
    let badgeHtml = html``;
    let isMainIconFan = false;
    let mainIconTooltip = "Statut de l'appareil";

    if (mode === "off" || mode === "unknown") {
      shapeColor = "rgba(128, 128, 128, 0.1)"; 
      mainIconTooltip = mode === "unknown" ? "Statut inconnu (Appareil hors ligne)" : "Appareil éteint";
    }

    if (deviceType === "ac") {
      switch (mode) {
        case "heat":
          mainIcon = "mdi:fire";
          mainIconColor = "rgba(255, 100, 0, 1)";
          mainIconTooltip = "Mode : Chauffage";
          break;
        case "cool":
          mainIcon = "mdi:snowflake";
          mainIconColor = "rgba(0, 191, 255, 1)";
          mainIconTooltip = "Mode : Climatisation (Froid)";
          break;
        case "fan_only":
          mainIcon = "mdi:fan";
          mainIconColor = "rgba(0, 255, 0, 1)";
          isMainIconFan = true;
          mainIconTooltip = "Mode : Ventilation seule";
          break;
        case "dry":
          mainIcon = "mdi:water-percent";
          mainIconColor = "rgba(0, 128, 128, 1)";
          mainIconTooltip = "Mode : Déshumidification";
          break;
        case "heat_cool":
          mainIcon = "mdi:autorenew";
          mainIconColor = "rgba(202, 206, 0, 1)";
          mainIconTooltip = "Mode : Automatique";
          break;
        case "off":
        default:
          mainIcon = mode === "unknown" ? "mdi:cloud-off-outline" : "mdi:power";
          mainIconColor = "rgba(255, 255, 255, 0.5)";
          break;
      }
      
      if (isCooling) {
        badgeHtml = html`<div class="cooling-badge" title="Activité : Refroidissement en cours"></div>`;
        mainIconTooltip += " (Refroidissement actif)";
      }
      if (isHeating) {
        badgeHtml = html`<div class="heating-badge" title="Activité : Chauffage en cours"></div>`;
        mainIconTooltip += " (Chauffage actif)";
      }

    } else {
      // Logique pour l'icône d'état principale (Bandeau du haut - "heater")
      if (mode === "off" || mode === "unknown") {
        mainIcon = mode === "unknown" ? "mdi:cloud-off-outline" : "mdi:radiator-off"; 
        mainIconColor = mode === "unknown" ? "rgba(255, 255, 255, 0.5)" : "rgba(128, 128, 128, 1)"; 
      } else if (mode === "heat") {
        mainIcon = "mdi:radiator"; 
        switch (preset) {
          case "comfort": mainIconColor = "rgba(255, 165, 0, 1)"; mainIconTooltip = "Preset : Confort"; break;
          case "eco": mainIconColor = "rgba(0, 128, 0, 1)"; mainIconTooltip = "Preset : Éco"; break;
          case "frost": mainIconColor = "rgba(0, 191, 255, 1)"; mainIconTooltip = "Preset : Hors-gel"; break;
          case "boost": mainIconColor = "rgba(255, 0, 0, 1)"; mainIconTooltip = "Preset : Boost"; break;
          case "none": default: mainIconColor = "rgba(255, 255, 0, 1)"; mainIconTooltip = "Mode : Manuel"; break;
        }
      }
      if (isHeating) {
        badgeHtml = html`<ha-icon icon="mdi:fire" class="heating-badge" title="Activité : En chauffe"></ha-icon>`;
        mainIconTooltip += " (En chauffe)";
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
                    <div class="ambient-temp-container" title="Température ambiante actuelle mesurée par la sonde">
                      <ha-icon icon="mdi:thermometer"></ha-icon>
                      <span>${currentRoomTemp}°C</span>
                    </div>
                  ` 
                : html`<div style="flex: 1;"></div>`
              }
              
              <div class="controls">
                <button class="btn-inc-dec" title="Diminuer la consigne" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, -1)}"><ha-icon icon="mdi:minus"></ha-icon></button>
                <span class="temp-display" title="Température de consigne ciblée">${displayTemp}</span>
                <button class="btn-inc-dec" title="Augmenter la consigne" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, 1)}"><ha-icon icon="mdi:plus"></ha-icon></button>
              </div>
            </div>
          </div>

          ${deviceType === "heater" 
            ? html`
                <div class="buttons2">
                  <button class="btn ${mode === 'heat' ? 'active-heat' : ''}" title="Allumer le chauffage" @click="${() => this._setHvacMode('heat')}">
                    <ha-icon icon="mdi:fire" class="${mode === 'heat' ? 'blink' : ''}" style="color: ${mode === 'heat' ? 'rgba(255, 0, 0, 1)' : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                    <span>on</span>
                  </button>
                  <button class="btn ${mode === 'off' ? 'active-off' : ''}" title="Éteindre le chauffage" @click="${() => this._setHvacMode('off')}">
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
                          let label = pMode;

                          switch (pMode) {
                            case "comfort": icon = "mdi:sofa"; color = "rgba(255, 165, 0, 1)"; label = "Confort"; break;
                            case "eco": icon = "mdi:leaf"; color = "rgba(0, 128, 0, 1)"; label = "Eco"; break;
                            case "frost": icon = "mdi:snowflake-thermometer"; color = "rgba(0, 191, 255, 1)"; label = "Hors gel"; break;
                            case "boost": icon = "mdi:rocket-launch"; color = "rgba(255, 0, 0, 1)"; label = "Boost"; break;
                            case "none": icon = "mdi:hand-back-right-outline"; color = "rgba(255, 255, 0, 1)"; label = "Manuel"; break;
                            case "home": icon = "mdi:home"; color = "rgba(33, 150, 243, 1)"; label = "Maison"; break;
                            case "away": icon = "mdi:walk"; color = "rgba(156, 39, 176, 1)"; label = "Absent"; break;
                            case "sleep": icon = "mdi:bed"; color = "rgba(63, 81, 181, 1)"; label = "Nuit"; break;
                          }

                          const isActive = preset === pMode;

                          return html`
                            <button class="btn" title="Passer en mode ${label}" @click="${() => this._setPreset(pMode)}">
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
                          let tooltip = hMode;
                          let isFan = false;
                          let isBlink = false;

                          switch (hMode) {
                            case "heat": icon = "mdi:fire"; color = "rgba(255, 100, 0, 1)"; label = "Heat"; tooltip = "Chauffage"; break;
                            case "cool": icon = "mdi:snowflake"; color = "rgba(0, 191, 255, 1)"; label = "Cool"; tooltip = "Climatisation (Froid)"; isBlink = (mode === "cool"); break;
                            case "fan_only": icon = "mdi:fan"; color = "rgba(0, 255, 0, 1)"; label = "Fan"; tooltip = "Ventilation seule";isFan = (mode === "fan_only"); break;
                            case "dry": icon = "mdi:water-percent"; color = "rgba(0, 128, 128, 1)"; label = "Dry"; tooltip = "Déshumidification"; break;
                            case "heat_cool": icon = "mdi:autorenew"; color = "rgba(202, 206, 0, 1)"; label = "Auto"; tooltip = "Automatique"; break;
                            case "off": icon = "mdi:power"; color = "rgba(255, 255, 255, 1)"; label = "Stop"; tooltip = "Éteindre / Arrêt"; break;
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
                  
                  <div class="control-dropdown" title="Vitesse de ventilation actuelle : ${fanMode.toUpperCase()}">
                    <ha-icon icon="mdi:fan-speed-1"></ha-icon>
                    <select @change="${(e) => this._setFanMode(e.target.value)}">
                      ${fanModes.map((fMode) => html`
                        <option value="${fMode}" ?selected="${fanMode === fMode}">${fMode.toUpperCase()}</option>
                      `)}
                    </select>
                  </div>

                  <div class="control-dropdown" title="Oscillation verticale actuelle : ${swingMode.toUpperCase()}">
                    <ha-icon icon="mdi:arrow-up-down-bold"></ha-icon>
                    <select @change="${(e) => this._setSwingMode(e.target.value)}">
                      ${swingModes.map((sMode) => html`
                        <option value="${sMode}" ?selected="${swingMode === sMode}">${sMode.toUpperCase()}</option>
                      `)}
                    </select>
                  </div>

                  <div class="control-dropdown" title="Oscillation horizontale actuelle : ${swingHorizontalMode.toUpperCase()}">
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
