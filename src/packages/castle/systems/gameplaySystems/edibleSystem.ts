import { addEntity, getComponents, getEntity, getEntityQuadtree, removeEntity } from "../../../sanguine/entities/entities.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab, getPrefabs } from "../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { sum } from "../../../sanguine/util/array.js";
import { EatComponent } from "../../components/eatComponent.js";
import { EdibleComponent } from "../../components/edibleComponent.js";
import { SizeComponent } from "../../components/sizeComponent.js";
import { CollisionMessage, LevelUpMessage, PlayerBouncedMessage, PlayerEatenMessage, PlayerEatMessage } from "./types.js";

const cellSize = 300;
const surroundingCellCount = 5;

export const edibleSystem = (
    messager: (message: Message) => void,
): System => {
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
                if (message.type !== 'collision') return;
                const { entity1, entity2, collisionPoint, time, timeAfterCollision } = message as CollisionMessage;

                const size1 = entity1.getComponent<SizeComponent>('size');
                const size2 = entity2.getComponent<SizeComponent>('size');

                if (!size1 || !size2) return;

                let eater = entity1;
                let eaterSize = size1;
                let edibleSize = size2;
                let edible = entity2;

                if (size1.size < size2.size) {
                    [eater, edible] = [edible, eater];
                    [eaterSize, edibleSize] = [edibleSize, eaterSize];
                } else if (size1.size === size2.size) {
                    if (size1.isPlayer && size2.isPlayer) {
                        if (edible.getComponent('eat')) {
                            [eater, edible] = [edible, eater];
                            [eaterSize, edibleSize] = [edibleSize, eaterSize];
                        }
                    } else if (size2.isPlayer) {
                        [eater, edible] = [edible, eater];
                        [eaterSize, edibleSize] = [edibleSize, eaterSize];
                    } else if (!size1.isPlayer) return;
                }

                const eatComponent = eater.getComponent<EatComponent>('eat');
                if (!eatComponent) return;
                const edibleComponent = edible.getComponent<EdibleComponent>('edible');
                if (!edibleComponent) {
                    if (edibleSize.isPlayer && edible.prefab?.type !== 'neck') {
                        const newMessage: PlayerBouncedMessage = {
                            type: 'playerBounced',
                            eater: eater,
                            collisionPoint,
                            timeOfCollision: time,
                            timeAfterCollision,
                        };
                        messager(newMessage);
                    }

                    return;
                }

                if (edibleSize.isPlayer) {
                    const message: PlayerEatenMessage = {
                        type: 'playerEaten',
                        eaten: edible,
                    };
                    messager(message);
                }

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

            if (!player) return;

            const quadtree = getEntityQuadtree();
            const gridSize = surroundingCellCount * 2 + 1;

            const minX = player.x - surroundingCellCount * cellSize * player.scale;
            const maxX = player.x + surroundingCellCount * cellSize * player.scale;
            const minY = player.y - surroundingCellCount * cellSize * player.scale;
            const maxY = player.y + surroundingCellCount * cellSize * player.scale;
            for (const edible of components as EdibleComponent[]) {
                const entity = getEntity(edible.entityId);
                if (entity.x < minX || entity.x > maxX ||
                    entity.y < minY || entity.y > maxY) {
                    removeEntity(entity.id);
                }
            }

            for (let x = 0; x < gridSize; x++) {
                for (let y = 0; y < gridSize; y++) {
                    if (x >= surroundingCellCount - 1
                        && x <= surroundingCellCount + 1
                        && y >= surroundingCellCount - 1
                        && y <= surroundingCellCount + 1
                    ) continue;

                    const xPosition = player.x + (x - surroundingCellCount) * cellSize * player.scale;
                    const yPosition = player.y + (y - surroundingCellCount) * cellSize * player.scale;

                    const anything = quadtree.nearest(xPosition, yPosition, cellSize * 1.1)
                        .some(x => x.getComponent('edible'));

                    if (anything) continue;

                    const rand = Math.random();
                    let ediblePrefab;
                    if (rand < .5) ediblePrefab = 'food';
                    else if (rand < .9) ediblePrefab = 'prey';
                    else if (rand < 1) ediblePrefab = 'predator';
                    else ediblePrefab = '';

                    const foodX = xPosition + Math.floor(Math.random() * cellSize) - cellSize / 2;
                    const foodY = yPosition + Math.floor(Math.random() * cellSize) - cellSize / 2;

                    const food = createEntity(foodX, foodY, getPrefab(ediblePrefab));
                    addEntity(food);
                }
            }
        },
    };
}