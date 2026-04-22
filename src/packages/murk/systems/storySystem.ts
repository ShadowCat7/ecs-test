import { loadInk } from "../../ink/ink.js";
import { addEntity } from "../../sanguine/entities/entities.js";
import { showEntity } from "../../sanguine/entities/entity.js";
import { getPrefab } from "../../sanguine/prefabs/prefabs.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Message, System } from "../../sanguine/types.js";
import { createControlTrigger, getFreshPress } from "../controls.js";
import { ContainerAddAnimatedMessage, ContainerAddMessage, ContainerDeleteChildrenMessage } from "./messageTypes.js";
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

    const dialogue = getPrefab('dialogue').createEntity(0, 0);
    addEntity(dialogue);

    const dialogueItemFab = getPrefab('dialogueItem');
    let dialogueItem = dialogueItemFab.createEntity(0, 0);
    let text = dialogueItem.renders?.find(x => x.type === 'text')!;
    if (!text) throw new Error('"dialogue" is missing render of type `text`.');

    const addBubble = (newText: string) => {
        dialogueItem = dialogueItemFab.createEntity(20, 0);
        text = dialogueItem.renders?.find(x => x.type === 'text')!;
        text.text = newText;
        addEntity(dialogueItem);
        const message: ContainerAddMessage = {
            type: 'containerAdd',
            entityId: dialogueItem.id,
            containerId: dialogue.id,
        };
        disabled = true;
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
            createTrigger('containerAddAnimated', (message: ContainerAddAnimatedMessage) => {
                if (message.containerId === dialogue.id)
                    disabled = false;
            }),
            createTrigger('storyStart', async (message: StoryStartMessage) => {
                showEntity(dialogue, true);
                currentStoryName = message.name;
                story = await loadInk(`./data/inks/${currentStoryName}.json`, {
                    variables: {
                        money,
                    }
                });
                next();
            }),
            createTrigger('storyEnd', (_: StoryEndMessage) => {
                showEntity(dialogue, false);
                currentStoryName = null;
                story = null;
                const message: ContainerDeleteChildrenMessage = {
                    type: 'containerDeleteChildren',
                    containerId: dialogue.id,
                };
                messager(message);
            })
        ],
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
