# Sanguine TypeScript ECS 2D Game Engine

* The Sanguine engine leverages web JavaScript modules to avoid bundling.
* tsc is still necessary but valuable.

## Development using the sanguine engine

* Copy sanguine directory directly into other code location.
* Call `createGame` from `sanguine/game.js` in a startup script file.
* Create an index.html file containing a `<canvas>` element and `<script type="module" src="dist/{startup script file location}"></script>`
* `tsc --watch` from parent directory.
* `componentsDirectory` should be the path to the directory from the root of the src
same for prefabs directories
* controls need to be instantiated via `setControlButtonMap` from `sanguine/buttons.js`, which will handle mapping from buttons to game controls. I recommend wrapping `getControlsInternal` like so:

```typescript
export type Control = 'left' | 'right' | 'up' | 'down';

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
}
```