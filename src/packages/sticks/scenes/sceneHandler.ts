import { changeScene, resetScene } from "../../sanguine/sceneManager.js";
import { assertUnreachable } from "../../sanguine/util/exhaustiveSwitch.js";
import { SceneType } from "../types.js";
import { cardPlayScene } from "./cardPlayScene.js";
import { roomPlayScene } from "./roomPlayScene.js";

const getScene = (sceneType: SceneType) => {
    switch (sceneType) {
        case "card":
            return cardPlayScene;
        case "room":
            return roomPlayScene;
        default:
            return assertUnreachable(sceneType);
    }
}

export const changeSceneType = (sceneType: SceneType) => {
    resetScene();
    const sceneCreator = getScene(sceneType);
    const scene = sceneCreator([]);
    changeScene(scene);
}