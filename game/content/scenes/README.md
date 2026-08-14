Допустим, у нас есть `Content`, `UI`, `Navigation` и несколько сцен.

### 1. Создаём Content

```js
const content = new Content();
```

Регистрируем сцены:

```js
const park = new Scene((data) => {
    ui.text('Ты находишься в парке.');

    ui.action(
        'Пойти домой',
        () => navigation.call('home')
    );
});

const home = new Scene((data) => {
    ui.text('Ты дома.');

    ui.action(
        'Вернуться в парк',
        () => navigation.call('park')
    );
});

content.scene('park', park);
content.scene('home', home);
```

---

### 2. Создаём Navigation

```js
const navigation = new Navigation({
    content,
    ui
});
```

Теперь можно запустить игру:

```js
navigation.goto('park');
```

`goto()` очистит стек и сделает:

```js
navigation.stack
```

таким:

```js
[
    {
        scene: 'park',
        data: {}
    }
]
```

После этого Navigation найдёт:

```js
content.scene('park')
```

и вызовет:

```js
park.run({});
```

---

## 3. Переход в другую сцену

Из `park`:

```js
navigation.call('home');
```

Теперь стек:

```js
[
    {
        scene: 'park',
        data: {}
    },
    {
        scene: 'home',
        data: {}
    }
]
```

А если в `home` вызвать:

```js
navigation.return();
```

получим обратно:

```js
[
    {
        scene: 'park',
        data: {}
    }
]
```

и `park` снова запустится.

---

# 4. Передача данных

Вот тут начинается самое интересное.

```js
navigation.call('park', {
    weather: 'rain',
    npc: 'guard'
});
```

Сцена получает:

```js
const park = new Scene((data) => {

    console.log(data.weather);
    // rain

    console.log(data.npc);
    // guard

});
```

---

# 5. Данные передаются дальше

Например:

```js
navigation.goto('park', {
    location: 'central-park'
});
```

В парке:

```js
navigation.call('dialogue', {
    npc: 'guard'
});
```

Стек:

```js
[
    {
        scene: 'park',
        data: {
            location: 'central-park'
        }
    },
    {
        scene: 'dialogue',
        data: {
            npc: 'guard'
        }
    }
]
```

`dialogue` получает:

```js
{
    location: 'central-park',
    npc: 'guard'
}
```

Потому что Navigation делает:

```js
getData()
```

и объединяет данные всех уровней.

---

# 6. Можно переопределять данные

Например:

```js
navigation.goto('park', {
    npc: 'guard'
});
```

Потом:

```js
navigation.call('dialogue', {
    npc: 'merchant'
});
```

В `dialogue`:

```js
data.npc
```

будет:

```text
merchant
```

То есть ближайшая сцена переопределяет родительские данные.

Это удобно для вложенных событий.

---

# 7. Повторный `call` той же сцены

Например, бой:

```js
navigation.call('fight', {
    enemy: 'wolf',
    turn: 1
});
```

Потом:

```js
navigation.call('fight', {
    enemy: 'wolf',
    turn: 2
});
```

Navigation **не создаст второй `fight`**.

Она заменит данные текущего:

```js
[
    {
        scene: 'fight',
        data: {
            enemy: 'wolf',
            turn: 2
        }
    }
]
```

Поэтому можно делать игровой цикл прямо через одну сцену:

```js
const fight = new Scene((data) => {

    ui.text(
        `Ход ${data.turn}`
    );

    ui.action(
        'Атаковать',
        () => {
            navigation.call('fight', {
                enemy: data.enemy,
                turn: data.turn + 1
            });
        }
    );
});
```

---

# 8. `goto` отличается

```js
navigation.goto('gameOver');
```

полностью сбрасывает историю:

```js
[
    {
        scene: 'gameOver',
        data: {}
    }
]
```

Поэтому:

```js
goto()
```

— **начать новую ветку навигации**.

А:

```js
call()
```

— **уйти глубже**.

И:

```js
return()
```

— **вернуться назад**.

---

## 9. Сохранение

У Navigation уже есть:

```js
toJSON()
```

Поэтому можно получить:

```js
const navigationData =
    navigation.toJSON();
```

Например:

```js
{
    stack: [
        {
            scene: 'park',
            data: {
                npc: 'guard'
            }
        },
        {
            scene: 'dialogue',
            data: {
                topic: 'gate'
            }
        }
    ]
}
```

А загрузить:

```js
navigation.fromJSON(navigationData);
```

И затем:

```js
navigation.run();
```

Navigation снова найдёт:

```js
content.scene('dialogue')
```

и продолжит игру.

---

### В итоге API получается буквально из пяти основных действий:

```js
navigation.goto('park');
navigation.call('dialogue', { npc: 'guard' });
navigation.return();

navigation.getScene();
navigation.getData();
```

А для сохранения:

```js
navigation.toJSON();
navigation.fromJSON(data);
```

