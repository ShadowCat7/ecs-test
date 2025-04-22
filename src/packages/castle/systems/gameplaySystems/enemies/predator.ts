import { getComponents, getEntity } from "../../../../sanguine/entities/entities.js";
import { EatComponent } from "../../../components/eatComponent.js";
import { EdibleComponent } from "../../../components/edibleComponent.js";
import { EnemyComponent } from "../../../components/enemyComponent.js";
import { SizeComponent } from "../../../components/sizeComponent.js";
import { getClosest } from "./enemyUtil.js";

export const predator = (enemyComponents: EnemyComponent[] | undefined) => {
    if (!enemyComponents?.length) return;

    const eaters = getComponents<EatComponent>('eat') ?? [];
    const edibles = getComponents<EdibleComponent>('edible') ?? [];

    for (let enemyComponent of enemyComponents) {
        const entity = getEntity(enemyComponent.entityId);
        const size = entity.getComponent<SizeComponent>('size')!;

        enemyComponent.state = {
            type: 'idle',
        };

        const closestEater = getClosest(eaters, entity, (other) => {
            const eaterSize = other.getComponent<SizeComponent>('size')!;
            return size.size < eaterSize.size;
        });

        if (closestEater) {
            enemyComponent.state = {
                type: 'flee',
                data: { x: closestEater.x, y: closestEater.y }
            };
            continue;
        }

        const closestEdible = getClosest(edibles, entity, (other) => {
            const edibleSize = other.getComponent<SizeComponent>('size')!;
            return size.size > edibleSize.size;
        });

        if (closestEdible) {
            enemyComponent.state = {
                type: 'chase',
                data: { x: closestEdible.x, y: closestEdible.y }
            };
            continue;
        }
    }
}