import { getMousePosition } from "../../sanguine/buttons.js";
import { measureText } from "../../sanguine/draw/drawText.js";
import { getEntity, removeEntity } from "../../sanguine/entities/entities.js";
import { Rectangle, Text } from "../../sanguine/render/types.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Entity, Message, System, WheelMessage } from "../../sanguine/types.js";
import { sum } from "../../sanguine/util/array.js";
import { beginInterpolate, quadraticOut } from "../../sanguine/util/interpolation.js";
import { clamp } from "../../sanguine/util/number.js";
import { ContainerComponent } from "../components/ui/containerComponent.js";
import { ContainerAddAnimatedMessage, ContainerAddMessage, ContainerDeleteChildrenMessage } from "./messageTypes.js";

const getContainerSize = (container: Entity) => {
    const firstChild = container.children[0];
    if (!firstChild) return 0;
    const lastChild = container.children[container.children.length - 1];
    const textRender = lastChild.renders?.find(x => x.type === 'text') as Text;
    return (lastChild.y - firstChild.y) + measureText(textRender.text, lastChild.x, lastChild.y, { maxWidth: textRender.maxWidth }).height;
};

const DEFAULT_ANIMATING_DURATION = 0.4;

export const containerSystem = (
    messager: (message: Message) => void,
): System => {
    const wheelEvents: number[] = [];
    let maxScrolled = false;
    let animating = false;
    let currentInterp = beginInterpolate(0, 0, quadraticOut);

    const messagePadding = 40;

    return {
        triggers: [
            createTrigger<ContainerAddMessage>('containerAdd', (message) => {
                const { containerId, entityId } = message;
                const container = getEntity(containerId);
                const containerComponent = container.getComponent<ContainerComponent>('container');
                if (!containerComponent) throw new Error('Container is not a container');

                const containerSize = getContainerSize(container);
                const lastY = containerSize + containerComponent.scrollY;

                const entity = getEntity(entityId);
                entity.y = lastY + messagePadding;
                if (entity.y === messagePadding) entity.y -= messagePadding - 20;
                container.children.push(entity);

                const textRender = entity.renders?.find(x => x.type === 'text') as Text;
                const textSize = measureText(textRender.text, 0, 0, { maxWidth: textRender.maxWidth });
                const rect: Rectangle = {
                    color: 'grey',
                    height: textSize.height + messagePadding / 4,
                    width: textSize.width + messagePadding / 4,
                    type: 'rectangle',
                    x: -messagePadding / 8,
                    y: -messagePadding / 8,
                    z: textRender.z - 1,
                    overlay: true,
                };
                entity.renders?.push(rect);

                const [_, screenHeight] = getScreenSize();
                if ((containerSize < screenHeight - 20 || maxScrolled) && entity.y - containerComponent.scrollY + textSize.height > screenHeight - 20) {
                    animating = true;
                    const animatingDistance = -textSize.height - messagePadding;
                    currentInterp = beginInterpolate(animatingDistance, DEFAULT_ANIMATING_DURATION, quadraticOut);
                    wheelEvents.push(animatingDistance);
                } else {
                    const message: ContainerAddAnimatedMessage = {
                        type: 'containerAddAnimated',
                        containerId: containerId,
                    };
                    messager(message);
                }
            }),
            createTrigger<ContainerDeleteChildrenMessage>('containerDeleteChildren', (message) => {
                const { containerId } = message;
                const container = getEntity(containerId);

                for (const entity of container.children) {
                    removeEntity(entity.id);
                }
                container.children.length = 0;
                const containerComponent = container.getComponent<ContainerComponent>('container')!;
                containerComponent.scrollY = 0;
            }),
            createTrigger<WheelMessage>('wheel', ({ delta }) => {
                if (animating) {
                    animating = false;
                    wheelEvents.length = 0;
                }
                wheelEvents.push(-delta);
            }),
        ],
        componentType: 'container',
        process: (components: Component[], elapsedTime: number) => {
            if (!wheelEvents.length) return;

            // TODO get relevant container to scroll
            const [mouseX, mouseY] = getMousePosition();

            let scrollingContainerComponent: ContainerComponent | null = null;
            for (const component of components as ContainerComponent[]) {
                scrollingContainerComponent = component;
            }

            if (!scrollingContainerComponent) {
                wheelEvents.length = 0;
                return;
            }

            let totalScroll = sum(wheelEvents, x => x);
            wheelEvents.length = 0;

            if (animating) {
                const newLocation = currentInterp(elapsedTime);
                if (newLocation === undefined) {
                    const message: ContainerAddAnimatedMessage = {
                        type: 'containerAddAnimated',
                        containerId: scrollingContainerComponent.entityId,
                    };
                    messager(message);
                    totalScroll = -100;
                    animating = false;
                } else {
                    totalScroll = newLocation;
                    wheelEvents.push(100);
                }
            }

            const [_, screenHeight] = getScreenSize();
            const container = getEntity(scrollingContainerComponent.entityId);
            const containerHeight = getContainerSize(container);
            const lowest = containerHeight <= (screenHeight - 40) ? 0 : (screenHeight - 40) - containerHeight;

            const oldPrevious = scrollingContainerComponent.scrollY;
            scrollingContainerComponent.scrollY += totalScroll;

            scrollingContainerComponent.scrollY = clamp(scrollingContainerComponent.scrollY, 0, lowest);

            maxScrolled = scrollingContainerComponent.scrollY === lowest;

            for (const child of container.children) {
                child.y = child.y - oldPrevious + scrollingContainerComponent.scrollY;
            }
        },
    };
};
