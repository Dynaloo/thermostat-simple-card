import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";

export class ThermostatSimpleCardEditor extends LitElement {
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
