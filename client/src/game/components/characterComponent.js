export const createCharacterComponent = (character) => {
    return {
        start: (data) => {
            data.character = character;
        },
        draw: () => {
        },
        update: (data, options) => {
            const { selected } = data;
            const { elapsedTime } = options;
        },
    };
}