import { BiomeTypes } from "../generation/types.js";
import { assertUnreachable } from "../utility/exhaustiveSwitch.js";

export const getColor = (biomeType: BiomeTypes) => {
    switch (biomeType) {
        case 'forest':
            return '#304529';
        case 'plains':
            return '#efef6e';
        case 'mountains':
            return '#8879b6';
        case 'swamp':
            return '#c68963';
        case 'water':
            return '#2986cc';
        default:
            return '#ff0000';
            // assertUnreachable(biomeType);
    }
}