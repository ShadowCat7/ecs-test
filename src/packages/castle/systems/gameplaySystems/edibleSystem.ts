import { addEntity, getComponents, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab, getPrefabs } from "../../../sanguine/prefabs/prefabs.js";
import { Component, Entity, Message, Prefab, System } from "../../../sanguine/types.js";
import { sum } from "../../../sanguine/util/array.js";
import { EatComponent } from "../../components/eatComponent.js";
import { EdibleComponent } from "../../components/edibleComponent.js";
import { SizeComponent } from "../../components/sizeComponent.js";
import { CollisionMessage } from "./physicsSystem.js";
import { LevelUpMessage, PlayerEatMessage } from "./types.js";

export const edibleSystem = (
    messager: (message: Message) => void,
): System => {
    const cellSize = 500;
    const surroundingCellCount = 5;
    let currentGridX: number | null = null;
    let currentGridY: number | null = null;

    let currentLevel = 1;
    let prefabs: { type: string, size: SizeComponent }[] = [];
    let currentPrefabs: { type: string, weight: number }[] = [];
    let max = 0;
    const setCurrentPrefabs = () => {
        currentPrefabs = prefabs.filter(x => x.size.size / currentLevel > 1 / 3 && x.size.size / currentLevel <= 2)
            .map(x => ({
                type: x.type,
                weight: currentLevel / x.size.size,
            }));
        max = sum(currentPrefabs, x => x.weight);
    }
    const getFoodType = () => {
        if (!prefabs.length) {
            prefabs = getPrefabs()
                .map(x => ({ type: x.type, size: x.components.map(y => y()).find(y => y.type === 'size') as SizeComponent }))
                .filter(x => x.size && x.type !== 'head' && x.type !== 'neck' && x.type !== 'tail');
            setCurrentPrefabs();
        }

        const rand = Math.random() * max;
        let runningTotal = 0;
        for (const prefab of currentPrefabs) {
            if (rand < runningTotal + prefab.weight) return prefab.type;
            runningTotal += prefab.weight;
        }

        return currentPrefabs[0].type;
    }

    return {
        triggers: [{
            messageType: 'collision',
            handler: (message: Message) => {
                const { entity1, entity2 } = message as CollisionMessage;

                const size1 = entity1.getComponent<SizeComponent>('size');
                const size2 = entity2.getComponent<SizeComponent>('size');

                if (!size1 || !size2) return;

                let eater = entity1;
                let eaterSize = size1;
                let edible = entity2;

                if (size1.size < size2.size) {
                    [eater, edible] = [edible, eater];
                    eaterSize = size2;
                } else if (size1.size === size2.size) {
                    if (size1.isPlayer && size2.isPlayer) {
                        if (edible.getComponent('eat'))
                            [eater, edible] = [edible, eater];
                    } else if (size2.isPlayer) {
                        [eater, edible] = [edible, eater];
                        eaterSize = size2;
                    }
                    else if (!size1.isPlayer) return;
                }

                const eatComponent = eater.getComponent<EatComponent>('eat');
                if (!eatComponent) return;
                const edibleComponent = edible.getComponent<EdibleComponent>('edible');
                if (!edibleComponent) return;

                if (edibleComponent.food && eaterSize.isPlayer) {
                    const message: PlayerEatMessage = {
                        type: 'playerEat',
                        amount: edibleComponent.food
                    };
                    messager(message);
                }

                removeEntity(edible.id);
            }
        }, {
            messageType: 'levelUp',
            handler: (message: Message) => {
                if (message.type === 'levelUp') {
                    const { level } = message as LevelUpMessage;
                    currentLevel = level;
                    setCurrentPrefabs();
                }
            }
        }],
        componentType: 'edible',
        process: (components: Component[], elapsedTime: number) => {
            const player = getEntity(getComponents('player')?.[0]?.entityId ?? '');
            currentGridX = player.x - surroundingCellCount * cellSize;
            currentGridY = player.y - surroundingCellCount * cellSize;

            const grid: number[][] = [];
            const gridSize = surroundingCellCount * 2 + 1;
            for (let i = 0; i < gridSize; i++) {
                grid.push(new Array(gridSize).fill(0));
            }


            for (const edible of components as EdibleComponent[]) {
                const entity = getEntity(edible.entityId);
                if (entity.prefab?.type === 'tail') continue;

                const x = Math.floor((entity.x - currentGridX) / cellSize);
                const y = Math.floor((entity.y - currentGridY) / cellSize);

                try {
                    if (x < 0 || x >= grid.length) {
                        removeEntity(entity.id);
                    } else if (y < 0 || y >= grid[x].length) {
                        removeEntity(entity.id);
                    } else {
                        grid[x][y]++;
                    }
                } catch (e) {
                    debugger
                }
            }

            for (let x = 0; x < gridSize; x++) {
                for (let y = 0; y < gridSize; y++) {
                    if (x >= surroundingCellCount - 1
                        && x <= surroundingCellCount + 1
                        && y >= surroundingCellCount - 1
                        && y <= surroundingCellCount + 1
                    ) continue;

                    if (!grid[x][y]) {
                        const xPosition = currentGridX + x * cellSize + Math.floor(Math.random() * cellSize);
                        const yPosition = currentGridY + y * cellSize + Math.floor(Math.random() * cellSize);

                        const rand = Math.random();
                        let ediblePrefab;
                        if (rand < .5) ediblePrefab = 'food';
                        else if (rand < .9) ediblePrefab = 'prey';
                        else if (rand < 1) ediblePrefab = 'predator';
                        else ediblePrefab = '';

                        const food = createEntity(xPosition, yPosition, getPrefab(ediblePrefab));
                        addEntity(food);
                    }
                }
            }
        },
    };
}