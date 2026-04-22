import { addEntity, getComponents, getEntity, getEntityQuadtree } from "../../../sanguine/entities/entities.js";
import { distance } from "../../../sanguine/physics/distance.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { getSize } from "../../../sanguine/render/render.js";
import { Circle, Render, Text } from "../../../sanguine/render/types.js";
import { Component, ControlMessage, Entity, Message, System } from "../../../sanguine/types.js";
import { ConversationComponent } from "../../components/conversationComponent.js";
import { PlayerComponent } from "../../components/playerComponent.js";
import { createControlTrigger, getKeyForControl } from "../../controls.js";
import { StoryEndMessage, StoryStartMessage } from "../types.js";

export const interactSystem = (
    messager: (message: Message) => void,
): System => {
    const convoPrefab = getPrefab('conversation');
    const convoCharacter1 = convoPrefab.createEntity(600, 600);
    addEntity(convoCharacter1);

    const convoCharacter2 = convoPrefab.createEntity(700, 600);
    addEntity(convoCharacter2);

    const playerComponent = getComponents<PlayerComponent>('player')?.at(0);
    if (!playerComponent) throw new Error('No player found.');
    const player = getEntity(playerComponent.entityId);

    let closestInteract: Entity | null = null;
    let highlight: Render | null = null;

    const setHighlight = () => {
        if (!closestInteract) return;
        const shape = closestInteract?.renders?.[0] as Circle;
        shape.outline = 3;
        shape.outlineColor = 'white';
        const size = getSize(shape);

        const textRender: Text = {
            text: getKeyForControl('interact')?.[0] ?? 'E',
            color: 'red',
            type: 'text',
            xAlign: 0,
            yAlign: -1,
            x: 0,
            y: -size.height / 2,
            z: 2,
        };
        highlight = textRender;
        closestInteract.renders ??= [];
        closestInteract.renders.push(highlight);
    };
    const removeHighlight = () => {
        const shape = closestInteract?.renders?.[0];
        if (shape) (shape as any).outline = undefined;

        if (highlight) {
            const index = closestInteract?.renders?.indexOf(highlight);
            if (index !== undefined && index > -1) {
                closestInteract?.renders?.splice(index, 1);
            }
        }
        highlight = null;
        closestInteract = null;
    };

    return {
        triggers: [
            createControlTrigger('interact', (message: ControlMessage) => {
                if (playerComponent.state !== 'dialogue' && message.current && !message.previous && closestInteract) {
                    playerComponent.state = 'dialogue';
                    const conversationComponent = closestInteract.getComponent<ConversationComponent>('conversation');
                    if (!conversationComponent) return;
                    const message: StoryStartMessage = { type: 'storyStart', name: conversationComponent.story };
                    removeHighlight();
                    messager(message);
                }
            }),
            createControlTrigger('escape', (message: ControlMessage) => {
                if (playerComponent.state === 'dialogue' && message.current && !message.previous) {
                    const message: StoryEndMessage = { type: 'storyEnd' };
                    messager(message);
                    playerComponent.state = undefined;
                }
            }),
        ],
        componentType: 'conversation',
        process: (components: Component[], elapsedTime: number) => {
            if (playerComponent.state === 'dialogue') return;

            const quadtree = getEntityQuadtree();
            const near = quadtree.nearest(player.x, player.y, 200).filter(x => x.getComponent('conversation'));
            let nearest = near[0];
            let nearestDistance = nearest ? distance(player.x, player.y, nearest.x, nearest.y) : 201;
            for (const entity of near) {
                const dist = distance(player.x, player.y, entity.x, entity.y);
                if (dist < nearestDistance) {
                    nearest = entity;
                    nearestDistance = dist;
                }
            }

            if (closestInteract !== nearest || nearestDistance >= 200) {
                removeHighlight();
                closestInteract = null;
            }

            if (nearest && nearestDistance < 200) {
                if (closestInteract === nearest) return;
                closestInteract = nearest;
                setHighlight();
            } else {
                closestInteract = null;
            }
        },
    };
};
