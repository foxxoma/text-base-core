import { Template } from '../Template.js';

export const hi = new Template(
    [
        'Привет, {name}!',
        'Рад тебя видеть, {name}.',
        'О, {name}, ты пришёл!'
    ]
);