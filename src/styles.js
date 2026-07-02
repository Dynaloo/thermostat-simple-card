import { css } from "https://unpkg.com/lit@3/index.js?module";

export const cardStyles = css`
  .card-container { padding: 0 16px 12px 16px; display: flex; flex-direction: column; gap: 5px; }
  .buttons1 { margin-top: 12px !important; }
  
  /* Alignement en ligne du bandeau et du bouton 3 points extérieur */
  .controls-row-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 8px;
  }

  /* Bandeau grisé de réglage (prend la place restante à gauche) */
  .mushroom-container { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    background: rgba(255,255,255,0.05); 
    padding: 6px; 
    border-radius: 12px;
    flex: 1;
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

  /* GESTION COMPLÈTE DU BOUTON 3 POINTS ET DU MENU DEROULANT DROIT */
  .menu-container-outside {
    position: relative;
    display: inline-block;
  }

  .custom-dots-btn {
    background: transparent;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, color 0.2s;
    padding: 0;
  }

  .custom-dots-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--primary-text-color);
  }

  .custom-dots-btn ha-icon {
    --mdc-icon-size: 24px;
  }

  /* Boîte de menu flottante */
  .custom-dropdown-menu {
    display: none;
    position: absolute;
    right: 0;
    top: 42px;
    background: var(--card-background-color, #1c1c1e);
    min-width: 180px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 99;
    overflow: hidden;
    padding: 4px 0;
  }

  .custom-dropdown-menu.show-menu {
    display: block;
  }

  /* Option cliquable à l'intérieur du menu */
  .dropdown-item {
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--primary-text-color);
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.15s;
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

  /* POP-UP MODAL HISTORIQUE */
  .dialog-header { display: flex; justify-content: space-between; align-items: center; width: 100%; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .dialog-header h2 { margin: 0; font-size: 18px; color: var(--primary-text-color); }
  .btn-close { background: transparent; border: none; cursor: pointer; color: var(--secondary-text-color); padding: 4px; display: flex; align-items: center; }
  .btn-close:hover { color: var(--primary-text-color); }
  .dialog-content { padding: 16px 0; color: var(--primary-text-color); min-width: 350px; }
  .dialog-content h3 { font-size: 13px; margin-top: 0; margin-bottom: 12px; color: var(--secondary-text-color); font-weight: 500; }

  .ac-advanced-controls { display: flex; justify-content: space-between; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); }
  .control-dropdown { display: flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.05); padding: 6px 10px; border-radius: 8px; flex: 1; justify-content: center; cursor: help; }
  .control-dropdown ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .control-dropdown select { background: transparent; border: none; color: var(--primary-text-color); font-size: 12px; font-weight: bold; outline: none; cursor: pointer; width: 100%; max-width: 75px; }
  .control-dropdown select option { background: var(--card-background-color, #1c1c1e); color: var(--primary-text-color); }
  
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .spin-animation { animation: spin 2.5s linear infinite; }
  @keyframes blink { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
  .blink { animation: blink 2s linear infinite; }
`;
