// import { GRID_SIZE } from "../../constants/game.js";
// import { cardComponent } from "../components/cards/cardComponent.js";
// import { drawLine } from "../draw/drawLine.js";
// import { drawRectangle } from "../draw/drawRectangle.js";
// import { addRender } from "../render/renderQueue.js";
// import { DrawOptions } from "../draw/types.js";
// import { Component, Entity } from "../types.js";
// import { createEntity } from "./entity.js";

// export const CARD_WIDTH = 100;
// export const CARD_HEIGHT = 200;

// const render = (entity: Entity, options: DrawOptions) => {
//     const { x, y } = entity;
//     const { ctx } = options;

//     addRender(2, () => {
//         drawRectangle(ctx, x, y, CARD_WIDTH, CARD_HEIGHT, 'white');
//         drawLine(ctx, x, y, x + CARD_WIDTH, y, 'black', 3);
//         drawLine(ctx, x, y + CARD_HEIGHT, x + CARD_WIDTH, y + CARD_HEIGHT, 'black', 3);
//         drawLine(ctx, x, y, x, y + CARD_HEIGHT, 'black', 3);
//         drawLine(ctx, x + CARD_WIDTH, y, x + CARD_WIDTH, y + CARD_HEIGHT, 'black', 3);
//     });
// }

// export const card = (x: number, y: number, cardType: string, components: Component[]) => {
//     return createEntity({
//         data: {
//             x,
//             y,
//         },
//         components: [cardComponent(), ...components],
//         render
//     });
// }