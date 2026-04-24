import { loadInk } from "../../ink/ink.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Message, System } from "../../sanguine/types.js";
import { createControlTrigger, getFreshPress } from "../controls.js";
import { DialogueAddMessage, DialogueReadyMessage } from "./gameplaySystems/types.js";
import { StoryEndMessage, StoryStartMessage } from "./types.js";

const getText = (text: string) => {
    return text.substring(0, text.length - 1).split('<br>');
};

export const storySystem = (
    messager: (message: Message) => void,
): System => {
    let currentStoryName: string | null = null;
    let story: any;
    let money = 0;
    let disabled = false;

    const addBubble = (newText: string) => {
        disabled = true;
        const message: DialogueAddMessage = {
            type: 'dialogueAdd',
            text: newText,
        };
        messager(message);
    };
    const getChoices = (choices: { index: number, text: string; }[]) => {
        return choices.map(({ index, text }) => `${index + 1}) ${text}`);
    };

    const next = () => {
        if (!story?.canContinue) return;
        const text = getText(story.Continue());

        if (story.currentTags.length) console.log('tags: ', story.currentTags.join(', '));

        if (story.currentChoices.length) {
            text.push(...getChoices(story.currentChoices));
        } else if (story.canContinue) console.log('--MORE--');
        else console.log('--END--');

        addBubble(text.join('\n'));
    };

    const choose = (choice: number) => {
        if (!story?.currentChoices?.length) return;
        story.ChooseChoiceIndex(choice);
        next();
    };

    return {
        triggers: [
            createControlTrigger('next', (message) => {
                if (!disabled && message.current && !message.previous) {
                    if (story) next();
                }
            }),
            createTrigger<DialogueReadyMessage>('dialogueReady', (message) => {
                disabled = false;
            }),
            createTrigger<StoryStartMessage>('storyStart', async (message) => {
                currentStoryName = message.name;
                story = await loadInk(`./data/inks/${currentStoryName}.json`, {
                    variables: {
                        money,
                    }
                });
                next();
            }),
            createTrigger<StoryEndMessage>('storyEnd', (_) => {
                currentStoryName = null;
                story = null;
            })
        ],
        componentType: 'example',
        process: (components: Component[], elapsedTime: number) => {
            if (!story) return;

            for (let i = 1; i < 10; i++) {
                if (getFreshPress(i.toString() as any)) {
                    choose(i - 1);
                }
            }
        },
    };
};
