import { addEntity, getCamera, getComponents, getEntity } from "../../sanguine/entities/entities.js";
import { createEntity } from "../../sanguine/entities/entity.js";
import { getPrefab } from "../../sanguine/prefabs/prefabs.js";
import { Component, Entity, Message, System } from "../../sanguine/types.js";
import { setMagnitude } from "../../sanguine/util/vector.js";
import { CameraComponent } from "../components/cameraComponent.js";
import { PhysicsComponent } from "../components/physicsComponent.js";
import { PlayerComponent } from "../components/playerComponent.js";
import { ZoomMessage } from "./gameplaySystems/types.js";

// TODO get from screen size
const xOffset = 800 / 600;

export const cameraSystem = (
    messager: (message: Message) => void,
): System => {
    const camera = createEntity(300, 300, getPrefab('camera'));
    const cameraComponent = camera.getComponent<CameraComponent>('camera')!;
    cameraComponent.active = true;
    addEntity(camera);

    let player: Entity | undefined = undefined;

    return {
        triggers: [{
            messageType: 'zoom',
            handler: (message) => {
                const { type, amount } = message as ZoomMessage;
                if (type !== 'zoom') return;
                const cameraEntity = getCamera();
                const camera = cameraEntity.getComponent<CameraComponent>('camera');
                if (!camera) return;
                camera.zoom = amount;
            }
        }],
        componentType: 'camera',
        process: (components: Component[], elapsedTime: number) => {
            if (!player) {
                const playerComponents = getComponents<PlayerComponent>('player');
                if (!playerComponents?.length) return;
                player = getEntity(playerComponents[0].entityId);
            }

            const playerPhysics = player.getComponent<PhysicsComponent>('physics');
            if (!playerPhysics) return;

            for (const component of components as CameraComponent[]) {
                if (!component.active) continue;
                const entity = getEntity(component.entityId);
                const physics = entity.getComponent<PhysicsComponent>('physics');
                if (!physics) continue;

                // get focal point of dangers and provide that as a possible affect

                entity.scale = player.scale;

                const [velocityX, velocityY] = setMagnitude(playerPhysics.velocityX, playerPhysics.velocityY, 70 * player.scale);
                physics.moveToX = player.x + velocityX * xOffset;
                physics.moveToY = player.y + velocityY;
            }
        }
    };
}