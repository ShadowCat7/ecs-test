import { getEntity } from "../../../../sanguine/entities/entities.js";
import { distance } from "../../../../sanguine/physics/distance.js";
import { Component, Entity } from "../../../../sanguine/types.js";

export const getClosest = (components: Component[], entity: Entity, filter: (other: Entity) => boolean) => {
    let closest: Component | null = null;
    let closestEntity: Entity | null = null;
    let closestDistance = 300 * entity.scale;
    for (let component of components) {
        if (component.entityId === entity.id) continue;

        const otherEntity = getEntity(component.entityId);

        if (!filter(otherEntity)) continue;

        const dist = distance(otherEntity.x, otherEntity.y, entity.x, entity.y);
        if (dist < closestDistance) {
            closest = component;
            closestEntity = otherEntity;
            closestDistance = dist;
        }
    }

    return closestEntity;
}