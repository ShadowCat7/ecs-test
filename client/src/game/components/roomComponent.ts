import { GRID_SIZE } from "../../constants/game.js";
import { drawRectangle } from "../draw/drawRectangle.js";
import { Component, EntityData } from "../entities/types.js";
import { BiomeTypes } from "../generation/types.js";
import { getColor } from "./util.js";

type RoomComponentData = {
    biome: BiomeTypes,
}

export const createRoomComponent = (): Component<EntityData & RoomComponentData> => {
    return {
        draw: (data, options) => {
            const { ctx } = options;
            const { x, y, biome } = data;

            drawRectangle(ctx, x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE, getColor(biome));
        },
        update(data, options) {
        },
    }
}