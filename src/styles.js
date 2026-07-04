import { css } from "https://unpkg.com/lit@3/index.js?module";

export const cardStyles = css`
  .card-container { padding: 0 16px 12px 16px; display: flex; flex-direction: column; gap: 5px; }
  .buttons1 { margin-top: 12px !important; }
  .mushroom-container { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 12px; }
  .ambient-temp-container { display: flex; align-items: center; gap: 4px; color: var(--secondary-text-color); font-size: 13px; font-weight: 500; flex: 1; justify-content: center; cursor: help; }
  .ambient-temp-container ha-icon { font-size: 16px !important; --mdc-icon-size: 16px !important; width: 16px !important; height: 16px !important; display: flex; align-items: center; justify-content: center; opacity: 0.7; }
  .icon-wrapper { position: relative; display: inline-flex; cursor: help; }
  
  .heating-badge { position: absolute; top: -6px; right: -6px; --mdc-icon-size: 14px; width: 14px; height: 14px; color: #ff5722; animation: pulse-red 2s infinite ease-in-out; pointer-events: none; }
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
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spin-animation { animation: spin 2.5s linear infinite; }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
  .blink { animation: blink 3s infinite; }

  @keyframes pulse-red {
    0% { transform: scale(0.9); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 2px #ff5722); }
    100% { transform: scale(0.9); opacity: 0.6; }
  }

  @keyframes pulse-blue {
    0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(0, 191, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); }
  }
`;
