export type Button = keyof typeof buttons;

export const buttons = {
    click: 'click',
    map: 'map',
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
} as const;