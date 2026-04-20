export const beginInterpolate = (
    distance: number,
    duration: number,
    easingFunction: (value: number) => number
) => {
    let timeLeft = duration;
    let lastValue = 0;
    return (elapsedTime: number) => {
        if (timeLeft <= 0) return undefined;

        const ratio = (duration - timeLeft) / duration;
        timeLeft -= elapsedTime;
        if (timeLeft < 0) timeLeft = 0;
        const eased = easingFunction(ratio) * distance;
        const delta = eased - lastValue;
        lastValue = eased;
        return delta;
    };
};

export const quadraticOut = (x: number) => 1 - (1 - x) * (1 - x);
