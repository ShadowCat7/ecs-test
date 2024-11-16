import { repeat } from "../../../util/array.js";
import { createDeck, Deck } from "../../../util/deck.js";
import { CardComponent } from "../../components/cards/cardComponent.js";
import { getControls } from "../../controls.js";
import { Card, data } from "../../data/data.js";
import { addEntity, getEntity, removeEntity } from "../../entities/entities.js";
import { isPointInRectangle } from "../../physics/rectangle.js";
import { getPrefab } from "../../prefabs/prefabs.js";
import { Component, Entity, Message, System } from "../../types.js";

export const cardSystem = (
    messager: (message: Message) => void,
): System => {
    let deck = createDeck(data.deck);
    let hand: Card[] = [];

    repeat(5, () => hand.push(deck.drawCard()!));

    const entities = hand.map((x, i) => {
        const fab = getPrefab(x.type);
        return fab.createEntity((800 - 500) / 2 + 100 * i, 600 - 160);
    });

    for (let entity of entities) {
        addEntity(entity);
    }

    let isPlayerTurn = true;

    const startEnemyTurn = () => {
        const message = {
            type: 'beginEnemyTurn',
        };

        messager(message);
    }

    return {
        triggers: [{
            messageType: 'beginPlayerTurn',
            handler: (message: Message) => {
                isPlayerTurn = true;
            }
        }],
        messageType: 'play',
        componentType: 'card',
        process: (components: Component[], elapsedTime: number) => {
            if (!isPlayerTurn) return;

            const {
                mouse: [mouseX, mouseY],
                buttons: { click }
            } = getControls();

            if (!(click.current && !click.previous)) return;

            for (const component of components as CardComponent[]) {
                const entity = getEntity(component.entityId);

                if (!isPointInRectangle(mouseX, mouseY, entity.x, entity.y, 100, 160)) { // TODO get from renderitem)
                    continue;
                }

                isPlayerTurn = false;

                const message = {
                    type: 'play',
                    entity,
                };

                messager(message);

                const handIndex = entities.findIndex(x => x.id === entity.id);
                removeEntity(entity.id);
                const discardedCard = hand[handIndex];

                for (let i = handIndex + 1; i < entities.length; i++) {
                    entities[i - 1] = entities[i];
                    hand[i - 1] = hand[i];
                }

                if (hand.length > 5) {
                    deck.discard(discardedCard);
                    startEnemyTurn();
                    break;
                }

                const newCard = deck.drawCard();
                if (newCard) {
                    const handSize = hand.length - 1;
                    hand[handSize] = newCard;
                    const fab = getPrefab(newCard.type);
                    const newEntity = fab.createEntity(0, 600 - 160);
                    entities[handSize] = newEntity
                    addEntity(newEntity);
                }

                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];
                    entity.x = (800 - 500) / 2 + 100 * i;
                }

                deck.discard(discardedCard);
                startEnemyTurn();
                break;
            }
        },
    };
}