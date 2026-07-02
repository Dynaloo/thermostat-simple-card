import { css } from "https://unpkg.com/lit@3/index.js?module";

export const cardStyles = css`
  .card-container { padding: 0 16px 12px 16px; display: flex; flex-direction: column; gap: 5px; }
  .buttons1 { margin-top: 12px !important; }
  
  .controls-row-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
  }

  .mushroom-container { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    background: rgba(255,255,255,0.05); 
    padding: 6px; 
    border-radius: 12px;
    flex: 1; /* S'étend pour prendre toute la place restante */
    min-width: 0;
  }

  .ambient-temp-container { display: flex; align-items: center; gap: 4px; color: var(--secondary-text-color); font-size: 13px; font-weight: 500; flex: 1; justify-content: center; cursor: help; }
  .ambient-temp-container ha-icon { font-size: 16px !important; --mdc-icon-size: 16px !important; width: 16px !important; height: 16px !important; display: flex; align-items: center; justify-content: center; opacity: 0.7; }
  .icon-wrapper { position: relative; display: inline-flex; cursor: help; }
  
  .heating-badge { position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #ff5722; border-radius: 50%; border: 2px solid var(--card-background-color, #1c1c1e); }
  .cooling-badge { position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #03a9f4; border-radius: 50%; border: 2px solid var(--card-background-color, #1c1c1e); }

  .shape { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .shape ha-icon { --mdc-icon-size: 22px; }

  .controls { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .btn-inc-dec { width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(255,255,255,0.08); color: var(--primary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
  .btn-inc-dec:hover:not([disabled]) { background: rgba(255,255,255,0.15); }
  .btn-inc-dec[disabled] { opacity: 0.3; cursor: not-allowed; }
  .btn-inc-dec ha-icon { --mdc-icon-size: 18px; }
  .temp-display { font-size: 15px; font-weight: bold; color: var(--primary-text-color); min-width: 45px; text-align: center; }

  /* FIX DU CONTENEUR DES 3 POINTS - LARGEUR GARANTIE */
  .menu-container-outside {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0; /* Empêche l'écrasement de l'élément à 0px */
  }

  .menu-container-outside ha-icon-button {
    color: var(--secondary-text-color);
    --mdc-icon-button-size: 40px;
  }

  .menu-container-outside ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .custom-dropdown-menu {
    position: absolute;
    right: 0;
    top: 44px;
    background: var(--card-background-color, #1c1c1e);
    min-width: 160px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    z-index: 9999 !important;
    overflow: hidden;
    padding: 4px 0;
  }

  .dropdown-item {
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--primary-text-color);
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
    white-space: nowrap;
  }

  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .dropdown-item ha-icon {
    color: var(--secondary-text-color);
    --mdc-icon-size: 18px;
  }

  .buttons2, .buttons3 { display: flex; justify-content: space-between; gap: 8px; margin-top: 5px; }
  .btn { flex: 1; height: 40px; border-radius: 10px; border: none; background: rgba(255,255,255,0.05); color: var(--primary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 500; transition: background-color 0.2s, box-shadow 0.2s; }
  .btn:hover { background: rgba(255,255,255,0.1); }
  .btn ha-icon { --mdc-icon-size: 18px; }

  .active-heat { background: rgba(255, 87, 34, 0.15) !important; border: 1px solid rgba(255, 87, 34, 0.3) !important; }
  .active-off { background: rgba(255, 255, 255, 0.1) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; }

  .card-header-container { padding: 12px 16px 4px 16px; }
  .main-title { font-size: 16px; font-weight: bold; color: var(--primary-text-color); }

  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .spin-animation { animation: spin 2.5s linear infinite; }
  @keyframes blink { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
  .blink { animation: blink 2s linear infinite; }
`;
