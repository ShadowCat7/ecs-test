export const createTimer = (duration: number, action: () => void) => {
    let timer = 0;

    return {
        update: (elapsedTime: number) => {
            timer += elapsedTime;

            if (timer >= duration) {
                action();
                timer -= duration;
            }
        }
    };
}