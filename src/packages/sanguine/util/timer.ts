export const createTimer = (duration: number, action: () => void) => {
    let timer = 0;

    return {
        update: (elapsedTime: number) => {
            timer += elapsedTime;

            if (timer >= duration) {
                action();
                timer -= duration;
            }
        },
        reset: () => {
            timer = 0;
        }
    };
}

export const createTimedSwitch = (duration: number, action: () => void) => {
    let timer = 0;
    let flipped = false;

    return {
        update: (elapsedTime: number) => {
            if (flipped) return;

            timer += elapsedTime;

            if (timer >= duration) {
                flipped = true;
                action();
                timer -= duration;
            }
        },
        reset: () => {
            flipped = false;
            timer = 0;
        }
    };
}