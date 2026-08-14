import { Scene } from '../Scene.js';

import { ui, navigation } from '../../../runtime.js';
import { content } from '../../../content.js';

export const park = new Scene((data) => {
    const player = data.player;
    const template = content.template(
        'npc.base.hi'
    );

    ui.set(
        'title',
        'Парк'
    );

    ui.set(
        'text',
        template.render({
            name: player.name
        })
    );

    ui.set(
        'status',
        `Здоровье: ${
            player.health.getIndex()
        } — ${
            player.health.render()
        }`
    );

    ui.addAction({
        text: 'Осмотреться',

        action: () => {
            ui.set(
                'text',
                'Вокруг тихо. Ты замечаешь старую скамейку.'
            );

            ui.apply()
        }
    });

    ui.addAction({
        text: 'Уйти из парка',

        action: () => {
            navigation.goto(
                'location.park',
                {
                    player
                }
            );
        }
    });

    ui.apply()
});