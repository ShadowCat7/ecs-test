import { loadInk, updateVars } from "../../ink/ink.js";
import { assertMessage } from "../../sanguine/messages.js";
import { Component, ControlMessage, Message, System } from "../../sanguine/types.js";
import { createControlTrigger, getFreshPress } from "../controls.js";
import { StoryStartMessage } from "./types.js";

const getText = (text: string) => {
    return text.split('<br>').join('\n');
};

export const storySystem = (
    messager: (message: Message) => void,
): System => {
    // initialization logic here

    let currentStoryName: string | null = null;
    let story: any;
    let money = 0;

    const next = () => {
        if (!story?.canContinue) return;

        console.log(getText(story.Continue()));

        if (story.currentTags.length) console.log('tags: ', story.currentTags.join(', '));

        if (story.currentChoices.length) {
            for (const choice of story.currentChoices) {
                const { index, text } = choice;
                console.log(`${index + 1}) ${getText(text)}`);
            }
        } else if (story.canContinue) console.log('--MORE--');
        else console.log('--END--');
    };

    const choose = (choice: number) => {
        if (!story?.currentChoices?.length) return;
        story.ChooseChoiceIndex(choice);
        next();
    };

    return {
        triggers: [
            createControlTrigger('next', (message: ControlMessage) => {
                if (message.current && !message.previous) {
                    if (story) next();
                }
            }),
            createControlTrigger('up', (message: ControlMessage) => {
                if (message.current && !message.previous) {
                    money++;
                    if (story) updateVars(story, { money });
                }
            }),
            {
                messageType: "storyStart",
                handler: async function (message: Message): Promise<void> {
                    assertMessage<StoryStartMessage>(message, 'storyStart');
                    currentStoryName = message.name;
                    story = await loadInk(`./data/inks/${currentStoryName}.json`, {
                        variables: {
                            money,
                        }
                    });
                    next();
                }
            }],
        componentType: 'example',
        process: (components: Component[], elapsedTime: number) => {
            if (getFreshPress('down')) {
                const message: StoryStartMessage = { type: 'storyStart', name: 'example' };
                messager(message);
            }

            if (!story) return;

            for (let i = 1; i < 9; i++) {
                if (getFreshPress(i.toString() as any)) {
                    choose(i - 1);
                }
            }
        },
    };
};
