import { GRID_SIZE } from "../../constants/game.js";
import { sum } from "../../util/array.js";
import { gridSquareDistaince } from "../physics/grid.js";
import { nextInt, randomItem } from "../utility/random.js";
import { Biome, BiomeTypes } from "./types.js";

export const biomeList: BiomeTypes[] = ['forest', 'plains', 'mountains', 'swamp', 'water'];

export type WorldLocation = {
    x: number,
    y: number,
    biomes: Biome[],
}

type BiomeTypeMap = {
    [key in BiomeTypes]?: number;
}

export const createWorld = () => {
    const biomes = [];

    for (let i = -1; i < 20; i++) {
        biomes.push({
            biome: randomItem(biomeList),
            x: i % 5 * 6 + 3 + nextInt(2),
            y: Math.floor(i / 4) * 7 + 3 + nextInt(3) - 1,
            size: 5 + nextInt(3),
        });
    }

    const worldLocations: WorldLocation[] = [];

    for (let j = 0; j < 600 / GRID_SIZE; j++) {
        for (let i = 0; i < 800 / GRID_SIZE; i++) {
            const x = i;
            const y = j;
            const biomeMap: BiomeTypeMap = {};

            for (let biome of biomes) {
                const dist = gridSquareDistaince(biome.x, biome.y, x, y);

                if (dist > biome.size) continue;

                // const asdf = biome.size + 1 - dist;

                const biomeAmount = 1 / (dist + 1);
                const existingValue = biomeMap[biome.biome];

                if (existingValue === undefined) {
                    biomeMap[biome.biome] = biomeAmount;
                } else {
                    biomeMap[biome.biome] = Math.min(existingValue + biomeAmount, 1);
                }
            }

            worldLocations.push({
                x,
                y,
                biomes: Object.entries(biomeMap).map(([key, value]) => ({ type: key as BiomeTypes, amount: value })),
            });
        }
    }

    console.log(worldLocations)

    // TODO handle blanks
    const blanks = worldLocations.filter(x => !x.biomes.length).length;
    console.log(blanks)

    const allRooms = worldLocations.flatMap(x => createRooms(x));

    // return worldLocations.map(x => ({
    //     ...x,
    //     x: x.x * GRID_SIZE,
    //     y: x.y * GRID_SIZE,
    // }));

    return {
        world: worldLocations,
        rooms: allRooms,
    };
}

const createRooms = (worldLocation: WorldLocation) => {
    const total = sum(worldLocation.biomes, x => x.amount);

    const rooms: { x: number, y: number, biome: BiomeTypes }[] = [];

    for (let j = 0; j < 600 / GRID_SIZE; j++) {
        for (let i = 0; i < 800 / GRID_SIZE; i++) {
            const randomNumber = Math.random() * total;
            const x = i;
            const y = j;

            let selected = false;
            let runningAmount = 0;
            let selectedIndex = 0;
            for (; (selectedIndex < worldLocation.biomes.length) && !selected; selectedIndex++) {
                const currentValue = worldLocation.biomes[selectedIndex].amount;
                runningAmount += currentValue;
                if (randomNumber < runningAmount) {
                    selected = true;
                }
            }

            // if (!worldLocation.biomes[selectedIndex]) debugger

            rooms.push({
                x: x + worldLocation.x * 800 / GRID_SIZE,
                y: y + worldLocation.y * 600 / GRID_SIZE,
                biome: worldLocation.biomes[selectedIndex - 1]?.type ?? '',
            });
        }
    }

    return rooms;
}