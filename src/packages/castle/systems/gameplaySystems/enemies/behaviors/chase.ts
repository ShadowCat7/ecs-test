import { Entity } from "../../../../../sanguine/types.js";
import { PhysicsComponent } from "../../../../components/physicsComponent.js";

export const chase = (entity: Entity, chaseX: number, chaseY: number) => {
    const physics = entity.getComponent<PhysicsComponent>('physics')!;
    physics.moveToX = chaseX;
    physics.moveToY = chaseY;
}