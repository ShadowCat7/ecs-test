import { Entity } from "../../../../../sanguine/types.js";
import { setMagnitude } from "../../../../../sanguine/util/vector.js";
import { PhysicsComponent } from "../../../../components/physicsComponent.js";

export const flee = (entity: Entity, fleeFromX: number, fleeFromY: number) => {
    const physics = entity.getComponent<PhysicsComponent>('physics')!;
    const [newVelocityX, newVelocityY] = setMagnitude(entity.x - fleeFromX, entity.y - fleeFromY, physics.topSpeed);
    physics.velocityToX = newVelocityX;
    physics.velocityToY = newVelocityY;
}