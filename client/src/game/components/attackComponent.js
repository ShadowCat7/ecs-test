import { roll, rollDice } from "../random.js";

export const createAttackComponent = () => {
    return {
        draw: (data, options) => {
        },
        update: (data, options) => {
            const { character, attack } = data;

            if (!attack) return;
            data.attack = null;

            const weaponAttack = character.getAttacks()[0];

            const result = roll(20, weaponAttack.getAttackRoll());
            const armorClass = attack.getData('character').getArmorClass();

            console.log(`${result} against AC ${armorClass}`)

            if (result < armorClass) {
                attack.getData('health').miss();
                return;
            }

            const damageDice = weaponAttack.getDamage();
            const damage = rollDice(damageDice);

            attack.getData('health').addHealth(-damage);
        }
    };
}