import { addEntity } from "../../../sanguine/entities/entities.js";
import { showEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { getSize } from "../../../sanguine/render/render.js";
import { Rectangle } from "../../../sanguine/render/types.js";
import { getScreenSize } from "../../../sanguine/screen.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Message, System, WheelMessage } from "../../../sanguine/types.js";
import { beginInterpolate, quadraticOut } from "../../../sanguine/util/interpolation.js";
import { ContainerComponent } from "../../components/ui/containerComponent.js";
import { ContainerAddMessage, ContainerDeleteChildrenMessage, ContainerScrollMessage } from "../messageTypes.js";
import { StoryEndMessage, StoryStartMessage } from "../types.js";
import { DialogueAddMessage, DialogueReadyMessage } from "./types.js";

const DEFAULT_ANIMATING_DURATION = 0.4;

export const dialogueSystem = (
    messager: (message: Message) => void,
): System => {
    let animating = false;
    let animatingDistance = 0;
    let currentInterp = beginInterpolate(0, 0, quadraticOut);

    const messagePadding = 40;

    const container = getPrefab('dialogue').createEntity(0, 0);
    const containerComponent = container.getComponent<ContainerComponent>('container');
    if (!containerComponent) throw new Error('Dialogue is not a container');
    addEntity(container);

    return {
        triggers: [
            createTrigger<StoryStartMessage>('storyStart', async (message) => {
                showEntity(container, true);
            }),
            createTrigger<StoryEndMessage>('storyEnd', (_) => {
                showEntity(container, false);
                const message: ContainerDeleteChildrenMessage = {
                    type: 'containerDeleteChildren',
                    containerId: container.id,
                };
                messager(message);
            }),
            createTrigger<DialogueAddMessage>('dialogueAdd', (message) => {
                const { text } = message;

                const dialogueItemFab = getPrefab('dialogueItem');
                const dialogueItem = dialogueItemFab.createEntity(20, 0);
                if (!dialogueItem.renders) dialogueItem.renders = [];
                const textRender = dialogueItem.renders.find(x => x.type === 'text')!;
                textRender.text = text;
                addEntity(dialogueItem);

                const size = getSize(dialogueItem.renders);

                const rect: Rectangle = {
                    color: 'dimgray',
                    height: size.height + messagePadding / 4,
                    width: size.width + messagePadding / 4,
                    type: 'rectangle',
                    x: -messagePadding / 8,
                    y: -messagePadding / 8,
                    z: (dialogueItem.renders[0].z ?? 0) - 1,
                    overlay: true,
                };
                dialogueItem.renders.push(rect);

                const containerAddMessage: ContainerAddMessage = {
                    type: 'containerAdd',
                    entityId: dialogueItem.id,
                    containerId: container.id,
                };
                messager(containerAddMessage);

                const [_, screenHeight] = getScreenSize();
                if (dialogueItem.y - containerComponent.scrollY + size.height > screenHeight - 20) {
                    animating = true;
                    animatingDistance = -size.height - messagePadding;
                    currentInterp = beginInterpolate(animatingDistance, DEFAULT_ANIMATING_DURATION, quadraticOut);
                } else {
                    const message: DialogueReadyMessage = {
                        type: 'dialogueReady',
                    };
                    messager(message);
                }
            }),
            createTrigger<WheelMessage>('wheel', ({ delta }) => {
                animating = false;
                animatingDistance = 0;
            }),
        ],
        componentType: 'dialogue',
        process: (components: Component[], elapsedTime: number) => {
            if (!animating) return;

            const newLocation = currentInterp(elapsedTime);
            if (newLocation === undefined) {
                const message: DialogueReadyMessage = {
                    type: 'dialogueReady',
                };
                messager(message);
                animating = false;
                return;
            }

            const message: ContainerScrollMessage = {
                type: 'containerScroll',
                containerId: container.id,
                scroll: newLocation,
            };
            messager(message);
        },
    };
};
