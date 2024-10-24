import { createMagelands } from "./game/magelands.js";

(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.oncontextmenu = () => false;
    canvas.width = 800;
    canvas.height = 600;

    createMagelands(canvas);
})();