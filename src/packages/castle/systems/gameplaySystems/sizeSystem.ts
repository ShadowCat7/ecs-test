import { getComponents, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { CollideableComponent } from "../../components/collideableComponent.js";
import { PlayerComponent } from "../../components/playerComponent.js";
import { SizeComponent } from "../../components/sizeComponent.js";
import { LevelUpMessage } from "./types.js";

const setSizes = (currentLevel: number) => {
    const components = getComponents<SizeComponent>('size');
    if (!components) return;

    for (let component of components) {
        const { entityId, size, isPlayer } = component;
        if (!isPlayer) {
            component.size = currentLevel;
            continue;
        };

        component.size = currentLevel;
        const entity = getEntity(entityId);
        entity.scale = 1 + currentLevel / 10;

        // const ratio = size / currentLevel;
        // if (ratio <= 1 / 3) {
        //     removeEntity(entityId);
        //     continue;
        // }

        // const entity = getEntity(entityId);
        // if (ratio < 1) {
        //     entity.scale = ratio;
        // } else if (ratio > 1) {
        //     entity.scale = Math.max(ratio, 2);
        // } else {
        //     entity.scale = 1;
        // }

        // const collideable = entity.getComponent<CollideableComponent>('collideable');
        // if (collideable) {
        //     collideable.currentRadius = collideable.radius * entity.scale;
        // }
    }
}

export const sizeSystem = (
    messager: (message: Message) => void,
): System => {
    let currentLevel = 1;

    return {
        triggers: [{
            messageType: 'levelUp',
            handler: (message: Message) => {
                if (message.type === 'levelUp') {
                    const { level } = message as LevelUpMessage;
                    currentLevel = level;
                }
            }
        }],
        componentType: 'size',
        process: (components: Component[], elapsedTime: number) => {
            const scale = 1 + currentLevel / 10;
            let playerScale: number | null = null;

            for (let component of components as SizeComponent[]) {
                const { entityId, size, isPlayer } = component;
                const entity = getEntity(entityId);
                if (!isPlayer) {
                    entity.scale = 1 + size / 10;
                    continue;
                }

                if (entity.scale !== scale) {
                    component.scaleSpeed = Math.min((component.scaleSpeed ?? 0) + 20 * elapsedTime, 10);
                    entity.scale = Math.min(entity.scale + component.scaleSpeed * elapsedTime, scale);
                    component.size = (entity.scale - 1) * 10;
                } else {
                    component.scaleSpeed = 0;
                }

                if (!playerScale)
                    playerScale = entity.scale;
            }

            const message = {
                type: 'zoom',
                amount: playerScale,
            };

            messager(message);
        },
    };
}