import { Render } from "./render/types.js";

export type ControlHistoryItem = {
    previous: boolean,
    current: boolean,
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

export type Prefab = {
    type: string,
    components: (() => Component)[],
    shapes?: Render[],
    prefabs?: Prefab[],
    script?: (entity: Entity) => void,
    createEntity: (x: number, y: number) => Entity,
}