import { CONTROLS } from "../../../constants/controls.js";
import { gridSize } from "../../../constants/game.js";
import { drawLine } from "../../draw/drawLine.js";
import { drawText } from "../../draw/drawText.js";
import { addDraw, DRAW_ORDER } from "../../draw/orderedDraw.js";
import { midpoint } from "../../physics/distance.js";
import { getDiagonalDiff, gridDistance, snapToGrid } from "../../physics/grid.js";
import { isPointInRectangle } from "../../physics/rectangle.js";

export const createCombatCharacterControlledComponent = () => {
    let isNotTargeting = true;

    return {
        draw: (data, options) => {
            addDraw(DRAW_ORDER.UI, () => {
                const { selected, character, x, y, width, height, moveTo, distanceTraveled, actions, movementActions, diagonals } = data;
                const { ctx, mouse } = options;

                if (!selected) return;

                const targetX = moveTo?.x ?? mouse.x;
                const targetY = moveTo?.y ?? mouse.y;
                const [mouseGridX, mouseGridY] = snapToGrid(targetX, targetY, gridSize);

                const dist = gridDistance(x, y, mouseGridX, mouseGridY, gridSize, diagonals) * 5;

                if (isNotTargeting) {
                    let lineColor = '#888888';
                    if (dist + distanceTraveled > character.getSpeed() * (actions + movementActions)) {
                        lineColor = 'red';
                    }

                    ctx.lineWidth = 3;
                    drawLine(ctx, x + width / 2, y + height / 2, mouseGridX + gridSize / 2, mouseGridY + gridSize / 2, lineColor);
                    ctx.lineWidth = 1;

                    if (dist) {
                        drawText(ctx, `${dist}`, mouseGridX + gridSize / 2, mouseGridY + gridSize / 2, {
                            textAlign: 'center',
                            textBaseline: 'middle',
                            fontSize: '16px',
                        });
                    }

                    if (!moveTo) {
                        const actionsSpent = Math.min((3 - (actions + movementActions)) + Math.ceil((distanceTraveled + dist) / character.getSpeed()), 3);

                        drawText(ctx, `${actionsSpent}/3`, ...midpoint(x + width / 2, y + height / 2, mouseGridX + gridSize / 2, mouseGridY + gridSize / 2), {
                            textAlign: 'center',
                            textBaseline: 'middle',
                            fontSize: '18px',
                        });
                    }
                } else {
                    // show that there will be an attack somehow
                }
            });
        },
        update: (data, options) => {
            const { x, y, selected, distanceTraveled, character, moveTo, actions, movementActions, diagonals, attack } = data;
            const { controls, entities } = options;
            const [mouseX, mouseY] = controls.getMouse();

            if (!selected || attack) return;

            isNotTargeting = true;

            for (let entity of entities) {
                if (entity.getData('id') === data.id) continue;

                const entityX = entity.getData('x');
                const entityY = entity.getData('y');
                const entityWidth = entity.getData('width');
                const entityHeight = entity.getData('height');

                if (isPointInRectangle(mouseX, mouseY, entityX, entityY, entityWidth, entityHeight)) {
                    isNotTargeting = false;

                    // check attack range
                    // const weapon = character.getW

                    if (controls.justPressed(CONTROLS.click) && data.actions) {
                        data.actions--;
                        data.attack = entity;
                    }
                }
            }

            if (isNotTargeting && !moveTo && controls.justPressed(CONTROLS.click)) {
                const [newX, newY] = snapToGrid(mouseX, mouseY, gridSize);

                const dist = gridDistance(x, y, newX, newY, gridSize, diagonals) * 5;
                if (!dist || dist + distanceTraveled > character.getSpeed() * (actions + movementActions)) {
                    return;
                }

                data.diagonals += getDiagonalDiff(x, y, newX, newY, gridSize);
                data.distanceTraveled += dist;

                const actionsSpent = Math.ceil(dist / character.getSpeed());
                data.movementActions += actionsSpent;
                data.actions -= actionsSpent;

                data.moveTo = {
                    x: newX + 1,
                    y: newY + 1,
                };
            }
        },
    };
}