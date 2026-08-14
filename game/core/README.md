# Core

Базовый runtime для текстовой игры.

Содержит:

* `Content` — хранение сцен и шаблонов;
* `Navigation` — переходы между сценами;
* `UI` — состояние интерфейса;
* `DOMUI` — вывод UI в DOM;
* `Time` — игровое время.

## Content

Хранит зарегистрированные сцены и шаблоны.

```javascript
const content = new Content();

content.scene('park', park);
content.scene('fight', fight);

content.template(
    'npc.greeting',
    greetingTemplate
);
```

Получение:

```javascript
content.scene('park');

content.template('npc.greeting');
```

Сцены и шаблоны обычно регистрируются в `content.js`.

## Navigation

Управляет текущей сценой и стеком переходов.

```javascript
const navigation = new Navigation({
    content,
    ui
});
```

### goto

Полностью заменяет текущую навигацию:

```javascript
navigation.goto('park');
```

Стек становится:

```text
park
```

Подходит для перехода в новое место, главного меню, Game Over и начала новой ветки.

### call

Открывает сцену поверх текущей:

```javascript
navigation.call('dialogue', {
    npcId: 'guard'
});
```

Стек:

```text
park
└── dialogue
```

`dialogue` получает переданные данные.

Если `call()` вызывается для той же текущей сцены, её данные обновляются вместо создания нового уровня:

```javascript
navigation.call('fight', {
    enemyId: 'wolf',
    turn: 1
});

navigation.call('fight', {
    enemyId: 'wolf',
    turn: 2
});
```

Стек остаётся:

```text
fight
```

### return

Возвращает предыдущую сцену:

```javascript
navigation.return();
```

```text
park
└── dialogue
```

становится:

```text
park
```

### Данные

Данные можно передавать при переходе:

```javascript
navigation.call('dialogue', {
    npcId: 'guard',
    topic: 'gate'
});
```

Вложенная сцена получает данные текущего и родительских уровней. Более глубокое значение переопределяет родительское.

```text
park
    location: "park"

dialogue
    npcId: "guard"

question
    topic: "gate"
```

Результат для `question`:

```javascript
{
    location: 'park',
    npcId: 'guard',
    topic: 'gate'
}
```

## UI

`UI` хранит содержимое интерфейса и не зависит от DOM.

```javascript
const ui = new UI();

ui.set(
    'text',
    'Ты входишь в парк.'
);

ui.set(
    'status',
    'Здоровье: 100'
);
```

Для действий:

```javascript
ui.addAction({
    text: 'Пойти домой',

    action: () => {
        navigation.goto('home');
    }
});
```

Сценарий может полностью самостоятельно решить, что выводить:

```javascript
const park = new Scene((data) => {

    ui.set(
        'title',
        'Парк'
    );

    ui.set(
        'text',
        'Ты находишься в парке.'
    );

    if (state.player.hasKey) {
        ui.addAction({
            text: 'Открыть ворота',

            action: () => {
                navigation.goto('gate');
            }
        });
    }
});
```

Перед запуском новой сцены `Navigation` очищает UI.

## DOMUI

`DOMUI` связывает `UI` с конкретными DOM-блоками.

```javascript
const domUI = new DOMUI(ui, {
    content: {
        title: '.title',
        text: '.text',
        status: '.status'
    },

    actions: '.actions'
});
```

После изменения UI:

```javascript
domUI.render();
```

HTML:

```html
<h1 class="title"></h1>
<div class="text"></div>
<div class="status"></div>
<div class="actions"></div>
```

`UI` не знает о HTML. `DOMUI` знает о HTML.

## Scene

Сцена находится в `content/scenes/` и является обычной функцией:

```javascript
const park = new Scene((data) => {

    ui.set(
        'text',
        'Ты находишься в парке.'
    );

    ui.addAction({
        text: 'Пойти в лес',

        action: () => {
            navigation.call('forest');
        }
    });
});
```

Внутри сцены можно использовать любой JavaScript и любые модули игры:

```javascript
Random
Template
Declension
DynamicState
Time
state
navigation
ui
```

## Связь Core

Основной поток:

```text
Navigation
    ↓
Scene
    ↓
UI
    ↓
DOMUI
    ↓
DOM
```

`Content` предоставляет Navigation нужную сцену:

```text
Navigation
    ↓
Content.scene('park')
    ↓
Scene
```

Объекты игрового состояния (`DynamicState`, `Time` и другие) не являются частью `Content`.

## Инициализация

Обычно core собирается в `game.js`:

```javascript
const content = new Content();

const ui = new UI();

const navigation = new Navigation({
    content,
    ui,

    onChange: () => {
        domUI.render();
    }
});

const domUI = new DOMUI(ui, {
    content: {
        title: '.title',
        text: '.text',
        status: '.status'
    },

    actions: '.actions'
});
```

После регистрации контента игра запускается:

```javascript
navigation.goto('location.park');
```

Core не определяет правила игры. Он предоставляет минимальные механизмы, которые используются игровым кодом.
