import { Render } from "./render/types.js";

export type ControlHistoryItem = {
    previous: boolean,
    current: boolean,
};

export type Mouse = {
    x: number,
    y: number,
    leftClick: boolean,
    rightClick: boolean,
};

export type Component = {
    type: string,
    entityId: string,
};

export type StateComponent<D, S> = Component & D & S;

export type Subscriber = (message: Message) => void;

export type Mailbox = {
    [messageType: string]: Subscriber[],
};

export type Entity = {
    id: string,
    components: Component[],
    x: number,
    y: number,
    visible: boolean,
    rotation: number,
    scale: number,
    renders?: Render[],
    prefab?: Prefab,
    getComponent: <T extends Component>(type: T["type"]) => T | undefined,
    addComponent: (component: Component) => void,
};

export type Prefab = {
    type: string,
    components: (() => Component)[],
    shapes?: Render[],
    prefabs?: Prefab[],
    script?: (entity: Entity) => void,
    createEntity: (x: number, y: number) => Entity,
};

export type System = {
    componentType: string | null,
    triggers?: Trigger[],
    process: ((components: Component[], elapsedTime: number) => void) | null,
};

export interface Trigger {
    messageType: string,
    handler: (message: Message) => void,
}

export interface Message {
    type: string,
}

export type TimerMessage = {
    type: 'timer',
    duration: number,
    responseType: string,
};

export type ControlMessage = {
    type: `control_${string}`,
    previous: boolean,
    current: boolean,
};
