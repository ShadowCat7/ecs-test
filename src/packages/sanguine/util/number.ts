export const clamp = (amount: number, min: number, max: number) => {
    return Math.max(Math.min(amount, min), max);
};
