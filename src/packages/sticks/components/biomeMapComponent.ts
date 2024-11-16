// import { GRID_SIZE } from "../../constants/game.js";
// import { drawRectangle } from "../draw/drawRectangle.js";
// import { Component, EntityData } from "../types.js";
// import { Biome } from "../generation/types.js";
// import { getColor } from "./util.js";

// export const createBiomeMapComponent = (): Component<EntityData & { biomes: Biome[] }> => {
//     return {
//         draw: (data, options) => {
//             const { ctx } = options;
//             const { x, y, biomes } = data;

//             for (let biome of biomes) {
//                 const color = getColor(biome.type);
//                 const alpha = Math.floor(biome.amount * 255).toString(16);

//                 drawRectangle(ctx, x, y, GRID_SIZE, GRID_SIZE, color + alpha);
//             }
//         },
//         update(data, options) {
//         },
//     }
// }