import { changeScene, resetScene } from "../../sanguine/sceneManager.js";
import { assertUnreachable } from "../../sanguine/util/exhaustiveSwitch.js";
import { SceneType } from "../types.js";
import { designerScene } from "./designerScene.js";
import { roomPlayScene } from "./roomPlayScene.js";

const getScene = (sceneType: SceneType) => {
    console.log(sceneType);
    switch (sceneType) {
        case 'test':
            return roomPlayScene;
        case 'designer':
            return designerScene;
        default:
            return assertUnreachable(sceneType);
    }
};

export const changeSceneType = (sceneType: SceneType) => {
    resetScene();
    const sceneCreator = getScene(sceneType);
    const scene = sceneCreator([]);
    changeScene(scene);
};
