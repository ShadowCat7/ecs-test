import { designerSystem } from "./designerSystem.js";
import { inkpadSystem } from "./inkpadSystem.js";
import { panelSystem } from "./panelSystem.js";
import { propertiesSystem } from "./propertiesSystem.js";
import { stampSystem } from "./stampSystem.js";

export const designerSystems = () => {
    const systems = [
        designerSystem,
        stampSystem,
        inkpadSystem,
        panelSystem,
        propertiesSystem,
    ];

    return systems;
};
