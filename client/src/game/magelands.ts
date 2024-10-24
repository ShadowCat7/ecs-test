import { buttons } from "../constants/controls.js";
import { GRID_SIZE } from "../constants/game.js";
import { createMapComponent } from "./components/mapComponent.js";
import { createBiomeMapComponent } from "./components/biomeMapComponent.js";
import { drawGrid } from "./draw/drawGrid.js";
import { createEntity } from "./entities/entity.js";
import { createGame } from "./game.js"
import { createWorld } from "./generation/world.js";
import { createScene } from "./scenes/scene.js";
import { Mouse, UpdateOptions } from "./types.js";
import { justPressed, released } from "./utility/buttons.js";
import { BiomeTypes } from "./generation/types.js";
import { createRoomComponent } from "./components/roomComponent.js";

let width = 0;
let height = 0;

const getBiomeScene = (world: ReturnType<typeof createWorld>) => {
    return createScene(world.world.map(x => createEntity({
        data: {
            ...x,
            x: x.x * GRID_SIZE,
            y: x.y * GRID_SIZE,
        },
        components: [createBiomeMapComponent()],
    })));
}

const getMapScene = (world: ReturnType<typeof createWorld>) => {
    return createScene(world.rooms.map(x => createEntity({
        data: x,
        components: [createMapComponent()],
    })));
}

type RoomSpace = {
    x: number,
    y: number,
    biome: BiomeTypes,
}

const worldWidth = 800 / GRID_SIZE;
const worldHeight = 800 / GRID_SIZE;
const roomWidth = 800 / GRID_SIZE;
const roomHeight = 600 / GRID_SIZE;
const getRoomScene = (x: number, y: number, rooms: ReturnType<(typeof createWorld)>['rooms']) => {
    const spaces: RoomSpace[] = [];

    const startingIndex = x * roomWidth * roomHeight + y * roomWidth * roomHeight * worldWidth;

    for (let spaceY = 0; spaceY < roomHeight; spaceY++) {
        for (let spaceX = 0; spaceX < roomWidth; spaceX++) {
            const roomIndex = startingIndex + spaceY * roomWidth + spaceX;
            const room = rooms[roomIndex];

            spaces.push({
                x: spaceX,
                y: spaceY,
                biome: room.biome,
            });
        }
    }

    return createScene(spaces.map(x => createEntity({
        data: x,
        components: [createRoomComponent()],
    })));
}

export const createMagelands = (canvas: HTMLCanvasElement) => {
    width = canvas.width;
    height = canvas.height;

    const world = createWorld();

    const rooms = world.rooms
        .map(x => createEntity({
            data: x,
            components: [createMapComponent()],
        }));

    let roomX = 0;
    let roomY = 0;

    const mapScene = getMapScene(world);
    let roomScene = getRoomScene(roomX, roomY, world.rooms);
    let currentScene = roomScene;

    const draw = (ctx: CanvasRenderingContext2D, mouse: Mouse) => {
        drawGrid(ctx, 0, 0, width, height);

        currentScene.draw({ ctx, mouse });
    };

    const update = (options: UpdateOptions) => {
        const { controls } = options;
        let showMap = false;

        if (justPressed(controls, buttons.map)) {
            showMap = true;
            currentScene = mapScene;
        } else if (released(controls, buttons.map)) {
            showMap = false;
            currentScene = roomScene;
        }

        if (!showMap) {
            let changed = false;

            if (justPressed(controls, buttons.up)) {
                roomY = Math.max(0, roomY - 1);
                changed = true;
            } else if (justPressed(controls, buttons.down)) {
                roomY = Math.min(worldHeight - 1, roomY + 1);
                changed = true;
            } else if (justPressed(controls, buttons.left)) {
                roomX = Math.max(0, roomX - 1);
                changed = true;
            } else if (justPressed(controls, buttons.right)) {
                roomX = Math.min(worldWidth - 1, roomX + 1);
                changed = true;
            }

            if (changed) {
                console.log(roomX, roomY)
                roomScene = getRoomScene(roomX, roomY, world.rooms);
                currentScene = roomScene;
            }
        }

        currentScene.update(options);
    }

    createGame(canvas, () => { }, update, draw);
}