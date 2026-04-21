import { unsubscribe } from "./buttons.js";
import { resetEntities } from "./entities/entities.js";
import { Scene } from "./scene.js";

let currentScene: Scene | null = null; // TODO loading scene

export const resetScene = () => {
    resetEntities();
    unsubscribe();
};

export const changeScene = (scene: Scene) => {
    currentScene = scene;
};

export const getCurrentScene = () => {
    return currentScene;
};
