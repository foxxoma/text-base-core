
import { Content } from './core/Content.js';

//scenes
import { park } from './content/scenes/locations/park.js';


//templates
import { hi } from './content/templates/npc/base.js';


export const content = new Content();

content.scene(
    'location.park',
    park
);


content.template(
    'npc.base.hi',
    hi
);