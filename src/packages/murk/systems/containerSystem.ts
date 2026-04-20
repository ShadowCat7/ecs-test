import { getMousePosition } from "../../sanguine/buttons.js";
import { measureText } from "../../sanguine/draw/drawText.js";
import { getEntity, removeEntity } from "../../sanguine/entities/entities.js";
import { Text } from "../../sanguine/render/types.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Entity, Message, System, WheelMessage } from "../../sanguine/types.js";
import { sum } from "../../sanguine/util/array.js";
import { beginInterpolate, quadraticOut } from "../../sanguine/util/interpolation.js";
import { clamp } from "../../sanguine/util/number.js";
import { ContainerComponent } from "../components/ui/containerComponent.js";
import { ContainerAddAnimatedMessage, ContainerAddMessage, ContainerDeleteChildrenMessage } from "./messageTypes.js";

const getContainerSize = (container: Entity) => {
    const lastChild = container.children[container.children.length - 1];
    if (!lastChild) return 0;
    const textRender = lastChild.renders?.find(x => x.type === 'text') as Text;
    return lastChild.y + measureText(textRender.text, lastChild.x, lastChild.y).height;
};

const DEFAULT_ANIMATING_DURATION = 0.5;

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

                const lastY = getContainerSize(container);

                const entity = getEntity(entityId);
                entity.y = lastY + messagePadding;
                if (entity.y === messagePadding) entity.y -= messagePadding - 20;
                container.children.push(entity);

                const entityHeight = measureText((entity.renders?.find(x => x.type === 'text') as Text).text, 0, 0).height;

                const [_, screenHeight] = getScreenSize();
                if ((lastY < screenHeight - 20 || maxScrolled) && entity.y + entityHeight > screenHeight - 20) {
                    animating = true;
                    const animatingDistance = -entityHeight - messagePadding;
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

            const container = getEntity(scrollingContainerComponent.entityId);
            scrollingContainerComponent.scrollY += totalScroll;
            const containerHeight = getContainerSize(container);

            const [_, screenHeight] = getScreenSize();
            const lowest = containerHeight <= (screenHeight - 20) ? 0 : (screenHeight - 20) - containerHeight;

            scrollingContainerComponent.scrollY = clamp(scrollingContainerComponent.scrollY, 0, lowest);

            maxScrolled = scrollingContainerComponent.scrollY === lowest;

            for (const child of container.children) {
                if (!child.renders?.length) continue;
                for (const render of child.renders) {
                    render.y = scrollingContainerComponent.scrollY;
                }
            }
        },
    };
};
