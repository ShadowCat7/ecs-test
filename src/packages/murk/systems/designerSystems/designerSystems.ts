import { inkpadSystem } from "./inkpadSystem.js";
import { panelSystem } from "./panelSystem.js";
import { stampSystem } from "./stampSystem.js";

export const designerSystems = () => {
    const systems = [
        stampSystem,
        inkpadSystem,
        panelSystem,
    ];

    return systems;
};
