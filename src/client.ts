import { startup } from "./packages/castle/startup.js";

(async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.oncontextmenu = () => false;

    await startup(canvas);
})();