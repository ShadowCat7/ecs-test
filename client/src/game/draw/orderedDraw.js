let instructions = {};

export const DRAW_ORDER = {
    BACKGROUND: 100,
    GAME: 200,
    UI: 300,
}

export const addDraw = (rank, func) => {
    if (!instructions[rank]) {
        instructions[rank] = [];
    }

    instructions[rank].push(func);
}

export const drawInstructions = () => {
    for (let rank in instructions) {
        for (let instruction of instructions[rank]) {
            instruction();
        }
    }

    instructions = {};
}