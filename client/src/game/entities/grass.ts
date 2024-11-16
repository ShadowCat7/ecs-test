// import { GRID_SIZE } from "../../constants/game.js";
// import { FlammableComponent, flammableComponent } from "../components/flammableComponent.js";
// import { growableComponent } from "../components/growableComponent.js";
// import { drawRectangle } from "../draw/drawRectangle.js";
// import { addRender } from "../render/renderQueue.js";
// import { DrawOptions } from "../draw/types.js";
// import { Entity } from "../types.js";
// import { createEntity } from "./entity.js";

// const render = (entity: Entity, options: DrawOptions) => {
//     const { x, y } = entity;
//     const { ctx } = options;

//     const onFire = ((entity.getComponent('flammable') as FlammableComponent | undefined)?.igniteDuration ?? 0) > 0;

//     addRender(0, () => {
//         drawRectangle(ctx, x, y, GRID_SIZE, GRID_SIZE, onFire ? 'red' : 'green');
//     });
// };

// export const grass = (x: number, y: number) => {
//     return createEntity({
//         data: {
//             x,
//             y,
//         },
//         components: [flammableComponent()],//, growableComponent()],
//         render
//     });
// }