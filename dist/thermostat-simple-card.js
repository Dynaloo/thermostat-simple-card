import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';

class ThermostatSimpleCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const schema = [
      {
        name: "title",
        selector: { text: {} },
        label: "Titre de la carte (Optionnel)"
      },
      {
        name: "device_type",
        selector: {
          select: {
            options: [
              { value: "heater", label: "Chauffage classique" },
              { value: "ac", label: "Climatisation (AC)" }
            ]
          }
        },
        label: "Type d'appareil"
      },
      {
        name: "entity",
        selector: { entity: { domain: "climate" } },
        label: "Entité Thermostat (Obligatoire)"
      },
      {
        name: "current_temp_sensor",
        selector: { entity: { domain: "sensor" } },
        label: "Capteur de température réelle (Optionnel)"
      }
    ];

    const data = {
      device_type: "heater",
      ...this._config
    };

    return html`
      <ha-form
        .hass="${this.hass}"
        .data="${data}"
        .schema="${schema}"
        .computeLabel="${(schema) => schema.label}"
        @value-changed="${this._valueChanged}"
      ></ha-form>
    `;
  }

  _valueChanged(ev) {
    if (!this._config) return;
    const newConfig = ev.detail.value;
    if (JSON.stringify(this._config) === JSON.stringify(newConfig)) return;
    this._config = newConfig;

    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("thermostat-simple-card-editor", ThermostatSimpleCardEditor);

const cardStyles = css`
  .card-container { padding: 0 16px 12px 16px; display: flex; flex-direction: column; gap: 5px; }
  .buttons1 { margin-top: 12px !important; }
  .mushroom-container { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 12px; }
  .ambient-temp-container { display: flex; align-items: center; gap: 4px; color: var(--secondary-text-color); font-size: 13px; font-weight: 500; flex: 1; justify-content: center; cursor: help; }
  .ambient-temp-container ha-icon { font-size: 16px !important; --mdc-icon-size: 16px !important; width: 16px !important; height: 16px !important; display: flex; align-items: center; justify-content: center; opacity: 0.7; }
  .icon-wrapper { position: relative; display: inline-flex; cursor: help; }
  
  .heating-badge { position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #ff5722; border-radius: 50%; border: 2px solid var(--card-background-color, #1c1c1e); animation: pulse 2s infinite; }
  .cooling-badge { position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #00bfff; border-radius: 50%; border: 2px solid var(--card-background-color, #1c1c1e); animation: pulse-blue 2s infinite; }
  
  .shape { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.3s; }
  .shape ha-icon { font-size: 24px !important; --mdc-icon-size: 24px !important; width: 24px !important; height: 24px !important; display: flex; }
  .controls { display: flex; align-items: center; gap: 8px; }
  .btn-inc-dec { background: rgba(255, 255, 255, 0.08); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--primary-text-color); transition: background 0.2s, transform 0.1s; padding: 0; }
  .btn-inc-dec:hover:not(:disabled) { background: rgba(255, 255, 255, 0.15); }
  .btn-inc-dec:active:not(:disabled) { transform: scale(0.92); }
  .btn-inc-dec:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-inc-dec ha-icon { font-size: 16px !important; --mdc-icon-size: 16px !important; width: 16px !important; height: 16px !important; display: flex; }
  .temp-display { font-size: 16px; font-weight: bold; min-width: 50px; text-align: center; cursor: default; }
  
  .buttons2 { display: flex; justify-content: center; gap: 20px; margin-bottom: 8px; }
  .buttons2 .btn { width: 45% !important; flex: none !important; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); }
  .buttons2 .btn.active-heat { background: rgba(255, 0, 0, 0.1) !important; border: 1px solid rgba(255, 0, 0, 0.3); }
  .buttons2 .btn.active-off { background: rgba(255, 255, 255, 0.1) !important; border: 1px solid rgba(255, 255, 255, 0.3); }
  
  .buttons3 { display: flex; justify-content: space-between; gap: 5px; margin-bottom: 4px; flex-wrap: wrap; }
  .btn { background: transparent; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 6px 4px; border-radius: 8px; color: var(--primary-text-color); flex: 1; min-width: 50px; transition: background 0.2s; }
  .btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
  .btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn ha-icon { font-size: 30px !important; --mdc-icon-size: 30px !important; width: 30px !important; height: 30px !important; display: flex; }
  .btn span { font-size: 13px !important; font-weight: 500 !important; display: inline-block; margin-top: 2px; text-transform: capitalize; }

  .ac-advanced-controls { display: flex; justify-content: space-between; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); }
  .control-dropdown { display: flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.05); padding: 6px 10px; border-radius: 8px; flex: 1; justify-content: center; cursor: help; }
  .control-dropdown ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .control-dropdown select { background: transparent; border: none; color: var(--primary-text-color); font-size: 12px; font-weight: bold; outline: none; cursor: pointer; width: 100%; max-width: 75px; }
  .control-dropdown select option { background: var(--card-background-color, #1c1c1e); color: var(--primary-text-color); }
  
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .spin-animation { animation: spin 2.5s linear infinite; }
  @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
  .blink { animation: blink 3s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(255, 87, 34, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0); } }
  @keyframes pulse-blue { 0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(0, 191, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); } }
`;

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
    this.config = config;
  }

  // Liaison directe avec la variable importée
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
        <ha-card><div style="padding: 16px; color: red; font-weight: bold;">Entité introuvable ou indisponible : ${entityId}</div></ha-card>
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
    let shapeColor = "#000000"; 
    let badgeHtml = html``;
    let isMainIconFan = false;
    let mainIconTooltip = "Statut de l'appareil";

    if (mode === "off" || mode === "unknown") {
      shapeColor = "#808080"; 
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
          mainIconColor = "rgba(255, 255, 255, 1)";
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
      if (mode === "off" || mode === "unknown") {
        mainIcon = mode === "unknown" ? "mdi:cloud-off-outline" : "mdi:power"; 
        mainIconColor = "rgba(255, 255, 255, 1)"; 
      } else if (mode === "heat") {
        switch (preset) {
          case "comfort": mainIcon = "mdi:sofa"; mainIconColor = "rgba(255, 165, 0, 1)"; mainIconTooltip = "Preset : Confort"; break;
          case "eco": mainIcon = "mdi:leaf"; mainIconColor = "rgba(0, 128, 0, 1)"; mainIconTooltip = "Preset : Éco"; break;
          case "frost": mainIcon = "mdi:snowflake-thermometer"; mainIconColor = "rgba(0, 191, 255, 1)"; mainIconTooltip = "Preset : Hors-gel"; break;
          case "boost": mainIcon = "mdi:rocket-launch"; mainIconColor = "rgba(255, 0, 0, 1)"; mainIconTooltip = "Preset : Boost"; break;
          case "none": default: mainIcon = "mdi:hand-back-right-outline"; mainIconColor = "rgba(255, 255, 0, 1)"; mainIconTooltip = "Mode : Manuel"; break;
        }
      }
      if (isHeating) {
        badgeHtml = html`<div class="heating-badge" title="Activité : En chauffe"></div>`;
        mainIconTooltip += " (En chauffe)";
      }
    }

    const targetTemp = attributes.temperature ?? attributes.target_temp_low ?? '--';

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
                <button class="btn-inc-dec" title="Diminuer la consigne" .disabled="${mode === 'unknown' || mode === 'off'}" @click="${() => this._setTemp(stateObj, -1)}"><ha-icon icon="mdi:minus"></ha-icon></button>
                <span class="temp-display" title="Température de consigne ciblée">${targetTemp}°C</span>
                <button class="btn-inc-dec" title="Augmenter la consigne" .disabled="${mode === 'unknown' || mode === 'off'}" @click="${() => this._setTemp(stateObj, 1)}"><ha-icon icon="mdi:plus"></ha-icon></button>
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
                          let isFan = false;
                          let isBlink = false;

                          switch (hMode) {
                            case "heat":
                              icon = "mdi:fire";
                              color = "rgba(255, 100, 0, 1)";
                              label = "Heat";
                              break;
                            case "cool":
                              icon = "mdi:snowflake";
                              color = "rgba(0, 191, 255, 1)";
                              label = "Cool";
                              isBlink = (mode === "cool");
                              break;
                            case "fan_only":
                              icon = "mdi:fan";
                              color = "rgba(0, 255, 0, 1)";
                              label = "Fan";
                              isFan = (mode === "fan_only");
                              break;
                            case "dry":
                              icon = "mdi:water-percent";
                              color = "rgba(0, 128, 128, 1)";
                              label = "Dry";
                              break;
                            case "heat_cool":
                              icon = "mdi:autorenew";
                              color = "rgba(202, 206, 0, 1)";
                              label = "Auto";
                              break;
                            case "off":
                              icon = "mdi:power";
                              color = "rgba(255, 255, 255, 1)";
                              label = "Stop";
                              break;
                          }

                          const isActive = mode === hMode;

                          return html`
                            <button class="btn" title="Mode : ${label}" @click="${() => this._setHvacMode(hMode)}">
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
    const currentTemp = stateObj?.attributes?.temperature ?? stateObj?.attributes?.target_temp ?? 20;
    const step = stateObj?.attributes?.target_temp_step ?? 0.5;
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
