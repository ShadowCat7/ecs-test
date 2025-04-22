import { combatantSystem } from "./combatantSystem.js";
import { enemyDialogueSystem } from "./enemyDialogueSystem.js";
import { enemyTurnSystem } from "./enemyTurnSystem.js";
import { physicsSystem } from "../physicsSystem.js"
import { combatSystem } from "./combatSystem.js";

export const combatSystems = () => {
    const systems = [
        physicsSystem,
        combatSystem,
        combatantSystem, enemyTurnSystem, enemyDialogueSystem,
    ];

    return systems;
}