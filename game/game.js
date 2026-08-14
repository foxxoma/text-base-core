import { DynamicState } from './modules/DynamicState/DynamicState.js';
import { navigation } from './runtime.js';

export const player = {
    name: 'Алекс',

    health: new DynamicState(
        {
            '0:20': 'Критическое состояние',
            '21:50': 'Ранен',
            '51:80': 'Здоров',
            '81:100': 'Отличное состояние'
        },
        80,
        0,
        100
    )
};

export function start() {
    navigation.goto(
        'location.park',
        {
            player
        }
    );
}