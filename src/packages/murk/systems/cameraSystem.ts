import { addEntity, getCamera, getComponents, getEntity } from "../../sanguine/entities/entities.js";
import { createEntity } from "../../sanguine/entities/entity.js";
import { hypotenuse } from "../../sanguine/physics/triangle.js";
import { getPrefab } from "../../sanguine/prefabs/prefabs.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { Component, Entity, Message, System } from "../../sanguine/types.js";
import { setMagnitude } from "../../sanguine/util/vector.js";
import { CameraComponent } from "../components/cameraComponent.js";
import { PhysicsComponent } from "../components/physicsComponent.js";
import { PlayerComponent } from "../components/playerComponent.js";
import { ZoomMessage } from "./gameplaySystems/types.js";

export const cameraSystem = (
    messager: (message: Message) => void,
): System => {
    const camera = createEntity(300, 300, getPrefab('camera'));
    const cameraComponent = camera.getComponent<CameraComponent>('camera')!;
    cameraComponent.active = true;
    addEntity(camera);

    let player: Entity | undefined = undefined;

    return {
        triggers: [
            // {
            //     messageType: 'zoom',
            //     handler: (message) => {
            //         const { type, amount } = message as ZoomMessage;
            //         if (type !== 'zoom') return;
            //         const cameraEntity = getCamera();
            //         const camera = cameraEntity.getComponent<CameraComponent>('camera');
            //         if (!camera) return;
            //         camera.zoom = amount;
            //     }
            // }
        ],
        componentType: 'camera',
        process: (components: Component[], elapsedTime: number) => {
            if (!player) {
                const playerComponents = getComponents<PlayerComponent>('player');
                if (!playerComponents?.length) return;
                player = getEntity(playerComponents[0].entityId);
            }

            const playerPhysics = player.getComponent<PhysicsComponent>('physics');
            if (!playerPhysics) return;

            const [screenWidth, screenHeight] = getScreenSize();
            const xOffset = screenWidth / screenHeight;

            for (const component of components as CameraComponent[]) {
                if (!component.active) continue;
                const entity = getEntity(component.entityId);
                const physics = entity.getComponent<PhysicsComponent>('physics');
                if (!physics) continue;

                // get focal point of dangers and provide that as a possible affect

                entity.scale = player.scale;

                // let newCameraX = player.x;
                // let newCameraY = player.y;
                // const playerSpeed = hypotenuse(playerPhysics.velocityX, playerPhysics.velocityY);

                // if (playerSpeed > playerPhysics.topSpeed * player.scale + 1) {
                //     newCameraX = entity.x;
                //     newCameraY = entity.y;
                // }

                // const [cammeraOffsetX, cammeraOffsetY] = setMagnitude(playerPhysics.velocityX, playerPhysics.velocityY, 70 * player.scale);
                // physics.moveToX = newCameraX + cammeraOffsetX * xOffset;
                // physics.moveToY = newCameraY + cammeraOffsetY;
            }
        }
    };
}