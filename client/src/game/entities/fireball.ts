// import { GRID_SIZE } from "../../constants/game.js";
// import { fireComponent } from "../components/fireComponent.js";
// import { physicsComponent } from "../components/physicsComponent.js";
// import { drawRectangle } from "../draw/drawRectangle.js";
// import { addRender } from "../render/renderQueue.js";
// import { DrawOptions } from "../draw/types.js";
// import { Entity, UpdateOptions } from "../types.js";
// import { createEntity } from "./entity.js"

// export const fireball = (x: number, y: number) => {
//     let duration = 0;

//     const physics = physicsComponent({ topSpeed: 80 });

//     return createEntity({
//         data: {
//             x,
//             y,
//         },
//         components: [
//             physics,
//             fireComponent(),
//         ],
//         script: (entity: Entity, options: UpdateOptions) => {
//             const { elapsedTime } = options;

//             duration += elapsedTime;

//             if (duration >= 2) {
//                 duration -= 2;
//                 const randomDirection = Math.random() * 2 * Math.PI;
//                 physics.velocityX = Math.cos(randomDirection) * physics.topSpeed;
//                 physics.velocityY = Math.sin(randomDirection) * physics.topSpeed;
//             }
//         },
//         render: (entity: Entity, options: DrawOptions) => {
//             const { x, y } = entity;
//             const { ctx } = options;

//             addRender(1, () => {
//                 drawRectangle(ctx, x, y, GRID_SIZE, GRID_SIZE, 'red');
//             });
//         },
//     });
// }