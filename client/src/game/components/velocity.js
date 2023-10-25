export const createVelocityComponent = (character) => {
    return {
        start: (data) => {
            data.velocityX = 0;
            data.velocityY = 0;
            data.speed = 300;
        },
        draw: () => {
            
        },
        update: (data, options) => {
            const { velocityX, velocityY } = data;
            const { elapsedTime } = options;

            data.x += velocityX * elapsedTime;
            data.y += velocityY * elapsedTime;
        },
    };
}