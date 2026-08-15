import { Scene } from '../Scene.js';

import { ui, navigation } from '../../../runtime.js';
import { content } from '../../../content.js';

export const park = new Scene((data) => {
    const player = data.player;
    const hi = content.template(
        'npc.base.hi'
    );

    ui.set(
        'title',
        'Парк'
    );

    ui.set(
        'text',
        hi.render({
            name: player.name
        })
    );

    ui.set(
        'status',
        'Здоровье: {healthIndex} — {health}',
        {
            'healthIndex': player.health.getIndex(),
            'health': player.health.render()
        }
    );

    ui.addAction({
        text: 'Осмотреться',

        action: () => {
            player.health.regress(10);

            ui.set(
                'text',
                'Вокруг тихо. Ты замечаешь старую скамейку, а здоровье уплао на 10. просто так.'
            );

            ui.set(
                'status',
                `Здоровье: ${
                    player.health.getIndex()
                } — ${
                    player.health.render()
                }`
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