import { loadInk, updateVars } from "../../ink/ink.js";
import { addEntity, getComponents, getEntity, getEntityQuadtree } from "../../sanguine/entities/entities.js";
import { createEntity } from "../../sanguine/entities/entity.js";
import { assertMessage } from "../../sanguine/messages.js";
import { distance } from "../../sanguine/physics/distance.js";
import { getPrefab } from "../../sanguine/prefabs/prefabs.js";
import { Component, ControlMessage, Message, System } from "../../sanguine/types.js";
import { ConversationComponent } from "../components/conversationComponent.js";
import { PlayerComponent } from "../components/playerComponent.js";
import { createControlTrigger, getFreshPress } from "../controls.js";
import { StoryStartMessage } from "./types.js";

export const conversationSystem = (
    messager: (message: Message) => void,
): System => {
    const convoCharacter = createEntity(300, 300, getPrefab('conversation'));
    addEntity(convoCharacter);

    const playerComponent = getComponents<PlayerComponent>('player')?.at(0);
    if (!playerComponent) throw new Error('No player found.');
    const player = getEntity(playerComponent.entityId);

    return {
        triggers: [
            createControlTrigger('interact', (message: ControlMessage) => {
                if (message.current && !message.previous) {
                    const quadtree = getEntityQuadtree();
                    // TODO hard-coded width
                    const near = quadtree.nearest(player.x, player.y, 20).filter(x => x.getComponent('conversation'));
                    let nearest = near[0];
                    let nearestDistance = distance(player.x, player.y, nearest.x, nearest.y);
                    for (const entity of near) {
                        const dist = distance(player.x, player.y, entity.x, entity.y);
                        if (dist < nearestDistance) {
                            nearest = entity;
                            nearestDistance = dist;
                        }
                    }

                    if (nearest && nearestDistance < 200) {
                        const conversationComponent = nearest.getComponent<ConversationComponent>('conversation');
                        if (!conversationComponent) return;
                        const message: StoryStartMessage = { type: 'storyStart', name: conversationComponent.story };
                        messager(message);
                    }
                }
            }),
        ],
        componentType: null,
        process: null,
    };
};
