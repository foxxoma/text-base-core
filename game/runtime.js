import { UI } from './core/UI/UI.js';
import { DOMUI } from './core/UI/DOMUI.js';
import { Navigation } from './core/Navigation.js';

import { content } from './content.js';

export const ui = new UI();

export const domUI = new DOMUI(
    ui,
    {
        content: {
            title: '.game-title',
            text: '.game-text',
            status: '.game-status'
        },

        actions: '.game-actions'
    }
);

export const navigation = new Navigation({
    content,
    ui,

    onChange: () => {
        console.log('navigate')
    }
});