import { loadInk, updateVars } from "../../ink/ink.js";
import { addEntity } from "../../sanguine/entities/entities.js";
import { createEntity } from "../../sanguine/entities/entity.js";
import { assertMessage } from "../../sanguine/messages.js";
import { getPrefab } from "../../sanguine/prefabs/prefabs.js";
import { Component, ControlMessage, Message, System } from "../../sanguine/types.js";
import { createControlTrigger, getFreshPress } from "../controls.js";
import { StoryStartMessage } from "./types.js";

const getText = (text: string) => {
    return text.split('<br>').join('\n');
};

export const storySystem = (
    messager: (message: Message) => void,
): System => {
    let currentStoryName: string | null = null;
    let story: any;
    let money = 0;

    const dialogueEntity = createEntity(0, 0, getPrefab('dialogue'));
    addEntity(dialogueEntity);
    const text = dialogueEntity.prefab?.shapes?.find(x => x.type === 'text');
    if (!text) throw new Error('"dialogue" is missing render of type `text`.');
    const changeText = (newText: string) => {
        text.text = newText;
    };
    const addText = (newText: string) => {
        text.text += newText;
        console.log(text.text);
    };
    const addChoices = (choices: { index: number, text: string; }[]) => {
        const choiceText = [];
        for (const { index, text } of choices) {
            choiceText.push(`${index + 1}) ${text}`);
        }
        addText(choiceText.join('\n'));
    };

    const next = () => {
        if (!story?.canContinue) return;

        changeText(getText(story.Continue()));

        if (story.currentTags.length) console.log('tags: ', story.currentTags.join(', '));

        if (story.currentChoices.length) {
            addChoices(story.currentChoices);
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
            if (!story) return;

            for (let i = 1; i < 9; i++) {
                if (getFreshPress(i.toString() as any)) {
                    choose(i - 1);
                }
            }
        },
    };
};
