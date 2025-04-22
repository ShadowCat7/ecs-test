import { Component, Message, System } from "../../sanguine/types.js";
import { TimerMessage } from "../messages.js";

type Timer = undefined | TimerMessage & { elapsed: number }

export const timerSystem = (
    messager: (message: Message) => void,
): System => {
    let timers: Timer[] = [];

    return {
        triggers: [{
            messageType: 'timer',
            handler: (message: Message) => {
                const nextIndex = timers.indexOf(undefined);

                if (nextIndex === -1) {
                    timers.push({
                        ...(message as TimerMessage),
                        elapsed: 0,
                    });
                } else {
                    timers[nextIndex] = {
                        ...(message as TimerMessage),
                        elapsed: 0,
                    };
                }
            }
        }],
        componentType: 'enemy',
        process: (components: Component[], elapsedTime: number) => {
            const cachedTimers = [...timers];

            for (let i = 0; i < cachedTimers.length; i++) {
                const timer = cachedTimers[i];
                if (!timer) continue;

                timer.elapsed += elapsedTime;
                if (timer.elapsed >= timer.duration) {
                    timers[i] = undefined;
                    messager({
                        type: timer.responseType
                    });
                }
            }
        },
    };
}