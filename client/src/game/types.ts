import { Button } from "../constants/controls.js";
import { DrawOptions } from "./draw/types.js";
import { Prefab } from "./prefabs/types.js";
import { Render } from "./render/types.js";

export type ControlHistoryItem = {
    previous: boolean,
    current: boolean,
}

export type ButtonControls = {
    [key in Button]: ControlHistoryItem
}

export type Controls = {
    mouse: [number, number],
    buttons: ButtonControls,
}

export type UpdateOptions = {
    controls: Controls,
    elapsedTime: number,
}

export type Mouse = {
    x: number,
    y: number,
    leftClick: boolean,
    rightClick: boolean,
}

export type Component = {
    type: string,
    entityId: string,
}

export type StateComponent<D, S> = Component & D & S;

export type Subscriber = (message: Message) => void;

export type Mailbox = {
    [messageType: string]: Subscriber[],
}

export type Entity = {
    id: string,
    components: Component[],
    x: number,
    y: number,
    visible: boolean,
    rotation: number,
    renders?: Render[],
    prefab?: Prefab,
    update: (options: UpdateOptions) => void,
    getComponent: <T extends Component>(type: string) => T | undefined,
    addComponent: (component: Component) => void,
}

export type Message = {
    type: string,
}

export type System = {
    componentType: string,
    messageType?: string,
    triggers?: Trigger[],
    process: (components: Component[], elapsedTime: number) => void,
}

export type Trigger = {
    messageType: string,
    handler: (message: Message) => void,
}