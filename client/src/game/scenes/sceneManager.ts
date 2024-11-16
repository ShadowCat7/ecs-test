import { resetEntities } from "../entities/entities.js";
import { cardPlayScene } from "./cardPlayScene.js";
import { roomPlayScene } from "./roomPlayScene.js";
import { Scene } from "./scene.js";

let currentScene: Scene | null = null; // TODO loading scene

export type SceneType = 'card' | 'room';

const exhaustiveCaseCheck = (value: never) => value;

const getScene = (sceneType: SceneType) => {
    switch (sceneType) {
        case "card":
            return cardPlayScene;
        case "room":
            return roomPlayScene;
        default:
            return exhaustiveCaseCheck(sceneType);
    }
}

export const changeScene = (sceneType: SceneType) => {
    resetEntities();
    const sceneCreator = getScene(sceneType);
    currentScene = sceneCreator([]);
}

export const getCurrentScene = () => {
    return currentScene;
}