import { drawRectangle } from "../draw/drawRectangle.js";
import { Component, EntityData } from "../entities/types.js";
import { BiomeTypes } from "../generation/types.js";
import { getColor } from "./util.js";

export const createMapComponent = (): Component<EntityData & { biome: BiomeTypes }> => {
    return {
        draw: (data, options) => {
            const { ctx } = options;
            const { x, y, biome } = data;

            const mapItemSize = 2;

            drawRectangle(ctx, x * mapItemSize, y * mapItemSize, mapItemSize, mapItemSize, getColor(biome));
        },
        update(data, options) {
        },
    }
}