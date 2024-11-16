import { drawRectangle } from "../../draw/drawRectangle.js";
import { drawText } from "../../draw/drawText.js";
import { addDraw, DRAW_ORDER } from "../../draw/orderedDraw.js";

const HEALTH_TIMER = 1;

export const createHealthComponent = () => {
    return {
        start: (data) => {
            let health = data.character.getHitPointMax();
            data.health = {
                getHealth: () => health,
                addHealth: (hp) => {
                    health += hp;
                    data.healthChanged = hp;
                    data.healthTimer = HEALTH_TIMER;
                    data.miss = false;
                },
                miss: () => {
                    data.healthTimer = HEALTH_TIMER;
                    data.healthChanged = 0;
                    data.miss = true;
                },
            };
        },
        draw: (data, options) => {
            addDraw(DRAW_ORDER.UI, () => {
                const { x, y, width, height, healthChanged, healthTimer, miss, character, health } = data;
                const { ctx } = options;

                if (healthTimer) {
                    const textY = y - 12 * (1 - healthTimer / HEALTH_TIMER);

                    let color = healthChanged < 0 ? 'red' : 'green';
                    if (healthChanged === 0) {
                        color = '#aaa';
                    }

                    const text = miss ? 'MISSED' : healthChanged.toString();

                    drawText(ctx, text, x + width / 2, textY, {
                        textAlign: 'center',
                        fontSize: '18px',
                        textBaseline: 'middle',
                        textColor: color,
                    });
                }

                const maxHp = character.getHitPointMax();
                const currentHp = health.getHealth();

                if (currentHp < maxHp) {
                    drawRectangle(ctx, x, y + height, width, 6, 'red');
                }

                drawRectangle(ctx, x, y + height, width * Math.max(currentHp / maxHp, 0), 6, 'green');
            });
        },
        update: (data, options) => {
            const { healthTimer } = data;
            const { elapsedTime } = options;

            if (healthTimer) {
                let timerValue = healthTimer;
                timerValue -= elapsedTime;

                if (healthTimer < 0) {
                    timerValue = 0;
                    data.miss = false;
                }

                data.healthTimer = timerValue;
            }
        }
    };
}