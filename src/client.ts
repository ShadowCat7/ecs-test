import { startup } from "./packages/murk/startup.js";

(async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.oncontextmenu = () => false;

    await startup(canvas);
})();