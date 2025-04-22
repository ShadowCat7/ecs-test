import { getComponents, getEntity } from "../../../../sanguine/entities/entities.js";
import { EnemyComponent } from "../../../components/enemyComponent.js";
import { SizeComponent } from "../../../components/sizeComponent.js";
import { getClosest } from "./enemyUtil.js";

export const prey = (enemyComponents: EnemyComponent[] | undefined) => {
    if (!enemyComponents?.length) return;

    const eaters = getComponents('eat') ?? [];

    for (let enemyComponent of enemyComponents) {
        const entity = getEntity(enemyComponent.entityId);
        const size = entity.getComponent<SizeComponent>('size')!;

        enemyComponent.state = {
            type: 'idle',
        };

        const closest = getClosest(eaters, entity, (other) => {
            const eaterSize = other.getComponent<SizeComponent>('size')!;
            return size.size <= eaterSize.size;
        });

        if (closest) {
            enemyComponent.state = {
                type: 'flee',
                data: { x: closest.x, y: closest.y }
            };
        }
    }
}