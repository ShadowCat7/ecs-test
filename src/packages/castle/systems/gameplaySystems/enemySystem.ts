import { addEntity, getComponents, getEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getControl } from "../../controls.js";
import { setMagnitude } from "../../../sanguine/util/vector.js";
import { FollowComponent } from "../../components/followComponent.js";
import { EnemyComponent } from "../../components/enemyComponent.js";
import { createQuadtree } from "../../../sanguine/util/quadtree.js";
import { distance } from "../../../sanguine/physics/distance.js";
import { prey } from "./enemies/prey.js";
import { idle } from "./enemies/behaviors/idle.js";
import { flee } from "./enemies/behaviors/flee.js";
import { groupMap } from "../../../sanguine/util/array.js";
import { predator } from "./enemies/predator.js";
import { chase } from "./enemies/behaviors/chase.js";

export const enemySystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [{
            messageType: 'enemyEat',
            handler: () => {
            },
        }],
        componentType: 'enemy',
        process: (components: Component[], elapsedTime: number) => {
            const edibles = getComponents('edible') ?? [];
            // const quadtree = createQuadtree(edibles.map(x => getEntity(x.entityId)));

            const enemies = components as EnemyComponent[];

            const enemyMap = groupMap(enemies, x => x.enemyType);
            prey(enemyMap.get('prey'));
            predator(enemyMap.get('predator'));

            for (let enemy of components as EnemyComponent[]) {
                // const nearest = quadtree.nearest(x, y, 400);
                const entity = getEntity(enemy.entityId);

                if (enemy.state?.type === 'idle') {
                    idle(entity, elapsedTime);
                } else if (enemy.state?.type === 'flee') {
                    flee(entity, enemy.state?.data?.x ?? 0, enemy.state?.data?.y ?? 0);
                } else if (enemy.state?.type === 'chase') {
                    chase(entity, enemy.state?.data?.x ?? 0, enemy.state?.data?.y ?? 0);
                }
            }
        }
    };
}