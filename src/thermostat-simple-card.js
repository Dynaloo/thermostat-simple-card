import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";
import "./thermostat-simple-card-editor.js"; 
import { cardStyles } from "./styles.js"; 

class ThermostatSimpleCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _showMenu: { type: Boolean }
    };
  }

  constructor() {
    super();
    this._showMenu = false;
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
    this.config = config;
  }

  static get styles() {
    return cardStyles;
  }

  _toggleMenu(e) {
    if (e) e.stopPropagation();
    this._showMenu = !this._showMenu;
  }

  _closeMenu() {
    this._showMenu = false;
  }

  _openHistory(e) {
    if (e) e.stopPropagation();
    this._showMenu = false;
    
    // Si un capteur de température dédiée est configuré, on ouvre son historique (graphique linéaire garanti)
    // Sinon, on ouvre l'historique du thermostat lui-même
    const targetEntity = this.config.current_temp_sensor || this.config.entity;
    
    const event = new CustomEvent("hass-more-info", {
      detail: { entityId: targetEntity },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
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
        <ha-card><div style="padding: 16px; color: var(--error-color, red); font-weight: bold;">Entité introuvable</div></ha-card>
      `;
    }

    const mode = stateObj.state ?? "unknown";
    const attributes = stateObj.attributes ?? {};
    const preset = attributes.preset_mode ?? "none";
    
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

    if (mode === "off" || mode === "unknown") {
      shapeColor = "rgba(128, 128, 128, 0.1)"; 
    }

    if (deviceType === "ac") {
      switch (mode) {
        case "heat": mainIcon = "mdi:fire"; mainIconColor = "rgba(255, 100, 0, 1)"; break;
        case "cool": mainIcon = "mdi:snowflake"; mainIconColor = "rgba(0, 191, 255, 1)"; break;
        case "fan_only": mainIcon = "mdi:fan"; mainIconColor = "rgba(0, 255, 0, 1)"; isMainIconFan = true; break;
        case "dry": mainIcon = "mdi:water-percent"; mainIconColor = "rgba(0, 128, 128, 1)"; break;
        case "heat_cool": mainIcon = "mdi:autorenew"; mainIconColor = "rgba(202, 206, 0, 1)"; break;
        default: mainIcon = "mdi:power"; mainIconColor = "rgba(255, 255, 255, 0.5)"; break;
      }
      if (isCooling) badgeHtml = html`<div class="cooling-badge"></div>`;
      if (isHeating) badgeHtml = html`<div class="heating-badge"></div>`;
    } else {
      if (mode === "off" || mode === "unknown") {
        mainIcon = "mdi:power"; mainIconColor = "rgba(255, 255, 255, 0.5)"; 
      } else if (mode === "heat") {
        switch (preset) {
          case "comfort": mainIcon = "mdi:sofa"; mainIconColor = "rgba(255, 165, 0, 1)"; break;
          case "eco": mainIcon = "mdi:leaf"; mainIconColor = "rgba(0, 128, 0, 1)"; break;
          case "frost": mainIcon = "mdi:snowflake-thermometer"; mainIconColor = "rgba(0, 191, 255, 1)"; break;
          case "boost": mainIcon = "mdi:rocket-launch"; mainIconColor = "rgba(255, 0, 0, 1)"; break;
          default: mainIcon = "mdi:hand-back-right-outline"; mainIconColor = "rgba(255, 255, 0, 1)"; break;
        }
      }
      if (isHeating) badgeHtml = html`<div class="heating-badge"></div>`;
    }

    const targetTemp = attributes.temperature ?? attributes.target_temp_low ?? null;
    const displayTemp = targetTemp !== null ? `${targetTemp}°C` : '--°C';

    return html`
      <ha-card @click="${this._closeMenu}">
        <div class="card-header-container">
          <div class="main-title">${this.config.title || ''}</div>
        </div>

        <div class="card-container">
          <div class="buttons1">
            <div class="controls-row-container">
              
              <div class="mushroom-container">
                <div class="icon-wrapper">
                  <div class="shape" style="background-color: ${shapeColor};">
                    <ha-icon .icon="${mainIcon}" class="${isMainIconFan ? 'spin-animation' : ''}" style="color: ${mainIconColor};"></ha-icon>
                  </div>
                  ${badgeHtml}
                </div>
                
                ${currentRoomTemp 
                  ? html`
                      <div class="ambient-temp-container">
                        <ha-icon icon="mdi:thermometer"></ha-icon>
                        <span>${currentRoomTemp}°C</span>
                      </div>
                    ` 
                  : html`<div style="flex: 1;"></div>`
                }
                
                <div class="controls">
                  <button class="btn-inc-dec" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, -1)}"><ha-icon icon="mdi:minus"></ha-icon></button>
                  <span class="temp-display">${displayTemp}</span>
                  <button class="btn-inc-dec" .disabled="${mode === 'unknown' || mode === 'off' || targetTemp === null}" @click="${() => this._setTemp(stateObj, 1)}"><ha-icon icon="mdi:plus"></ha-icon></button>
                </div>
              </div>

              <div class="menu-container-outside">
                <ha-icon-button @click="${this._toggleMenu}" title="Options">
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </ha-icon-button>
                
                <div class="custom-dropdown-menu" style="display: ${this._showMenu ? 'block' : 'none'};">
                  <div class="dropdown-item" @click="${this._openHistory}">
                    <ha-icon icon="mdi:chart-timeline-variant"></ha-icon>
                    <span>Historique complet</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          ${deviceType === "heater" 
            ? html`
                <div class="buttons2">
                  <button class="btn ${mode === 'heat' ? 'active-heat' : ''}" @click="${() => this._setHvacMode('heat')}">
                    <ha-icon icon="mdi:fire" class="${mode === 'heat' ? 'blink' : ''}" style="color: ${mode === 'heat' ? 'rgba(255, 0, 0, 1)' : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                    <span>on</span>
                  </button>
                  <button class="btn ${mode === 'off' ? 'active-off' : ''}" @click="${() => this._setHvacMode('off')}">
                    <ha-icon icon="mdi:power" style="color: ${mode === 'off' ? 'rgba(255, 255, 255, 1)' : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                    <span>off</span>
                  </button>
                </div>
              ` : html``
          }

          ${(deviceType === "heater" && mode !== "off" && mode !== "unknown") || deviceType === "ac"
            ? html`
                <div class="buttons3">
                  ${deviceType === "heater"
                    ? presetModes.map((pMode) => {
                        let icon = "mdi:bookmark"; let color = "rgba(128, 128, 128, 1)"; let label = pMode;
                        switch (pMode) {
                          case "comfort": icon = "mdi:sofa"; color = "rgba(255, 165, 0, 1)"; label = "Confort"; break;
                          case "eco": icon = "mdi:leaf"; color = "rgba(0, 128, 0, 1)"; label = "Eco"; break;
                          case "frost": icon = "mdi:snowflake-thermometer"; color = "rgba(0, 191, 255, 1)"; label = "Hors gel"; break;
                          case "boost": icon = "mdi:rocket-launch"; color = "rgba(255, 0, 0, 1)"; label = "Boost"; break;
                          case "none": icon = "mdi:hand-back-right-outline"; color = "rgba(255, 255, 0, 1)"; label = "Manuel"; break;
                        }
                        return html`
                          <button class="btn" @click="${() => this._setPreset(pMode)}">
                            <ha-icon icon="${icon}" style="color: ${preset === pMode ? color : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                            <span>${label}</span>
                          </button>
                        `;
                      })
                    : hvacModes.map((hMode) => {
                        let icon = "mdi:help-circle-outline"; let color = "rgba(128, 128, 128, 1)"; let label = hMode;
                        switch (hMode) {
                          case "heat": icon = "mdi:fire"; color = "rgba(255, 100, 0, 1)"; label = "Heat"; break;
                          case "cool": icon = "mdi:snowflake"; color = "rgba(0, 191, 255, 1)"; label = "Cool"; break;
                          case "fan_only": icon = "mdi:fan"; color = "rgba(0, 255, 0, 1)"; label = "Fan"; break;
                          case "dry": icon = "mdi:water-percent"; color = "rgba(0, 128, 128, 1)"; label = "Dry"; break;
                          case "heat_cool": icon = "mdi:autorenew"; color = "rgba(202, 206, 0, 1)"; label = "Auto"; break;
                          case "off": icon = "mdi:power"; color = "rgba(255, 255, 255, 1)"; label = "Stop"; break;
                        }
                        return html`
                          <button class="btn" @click="${() => this._setHvacMode(hMode)}">
                            <ha-icon icon="${icon}" class="${hMode === 'fan_only' && mode === 'fan_only' ? 'spin-animation' : ''}" style="color: ${mode === hMode ? color : 'rgba(128, 128, 128, 1)'}"></ha-icon>
                            <span>${label}</span>
                          </button>
                        `;
                      })
                  }
                </div>
              ` : html``
          }
        </div>
      </ha-card>
    `;
  }

  _setHvacMode(mode) { if (this.config?.entity) this.hass.callService("climate", "set_hvac_mode", { entity_id: this.config.entity, hvac_mode: mode }); }
  _setPreset(preset) { if (this.config?.entity) this.hass.callService("climate", "set_preset_mode", { entity_id: this.config.entity, preset_mode: preset }); }
  _setTemp(stateObj, direction) {
    if (!this.config?.entity) return;
    const currentTemp = parseFloat(stateObj?.attributes?.temperature ?? stateObj?.attributes?.target_temp ?? 20);
    const step = parseFloat(stateObj?.attributes?.target_temp_step ?? 0.5);
    this.hass.callService("climate", "set_temperature", { entity_id: this.config.entity, temperature: currentTemp + (direction * step) });
  }
}

customElements.define("thermostat-simple-card", ThermostatSimpleCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "thermostat-simple-card", name: "Thermostat Simple Card", description: "Carte avec menu d'historique stable." });
