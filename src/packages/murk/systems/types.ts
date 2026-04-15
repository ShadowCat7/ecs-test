import { Message } from "../../sanguine/types.js";

export type StoryStartMessage = Message & {
    type: 'storyStart',
    name: string,
};

export type StoryEndMessage = Message & {
    type: 'storyEnd',
};
