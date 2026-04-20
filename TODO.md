murk:
Build dialogue
    if not fully scrolled and then next, scroll to bottom
    make container system work with multiple containers existing

infra:
don't duplicate renders but keep track of state elsewhere
    aka separate prefab data with entity state

castle:
problems:
    only handle messages for certain component types?
    variable text
    on animation end, fire event

features:
    move bouncing to general location
    enemy spawns
    reset scale and size on new level

think about:
    size scaling after food gets small enough
    tail growth

fixes:
    sometimes predators don't move
        sometimes they don't eat food they're on top of
    fix moving too fast for new tail segments at first

game feel:
animations
sound
permanence
camera lerp
camera position
screen shake
sleep
more bass
camera kick
provide meaning