# 🧠 DynamicState

Числовое состояние с диапазонами, эффектами и событиями изменения.

Поддерживает:

* `minIndex` / `maxIndex`;
* автоматический `clamp`;
* диапазоны состояний;
* именованные эффекты `name: value`;
* кастомный расчёт через callback;
* подписку на изменения состояния.

---

## Создание

```javascript
const health = new DynamicState(
    {
        '0:20': 'Critical',
        '21:50': 'Wounded',
        '51:80': 'Healthy',
        '81:100': 'Excellent'
    },
    70,
    0,
    100
);
```

Параметры конструктора:

```javascript
new DynamicState(
    steps,
    index,
    minIndex,
    maxIndex,
    effects
);
```

---

## Значение

Изменение основного значения:

```javascript
health.setIndex(50);

health.progress(10);

health.regress(5);
```

Получение значения:

```javascript
health.getIndex();
```

`getIndex()` учитывает активные эффекты.

---

## Effects

По умолчанию эффекты складываются с `index`.

```javascript
health.setEffect('poison', -10);
health.setEffect('blessing', 5);

health.getIndex();
// 65
```

Работа с эффектами:

```javascript
health.hasEffect('poison');

health.getEffect('poison');

health.getEffects();

health.removeEffect('poison');

health.clearEffects();
```

Эффекты не изменяют непосредственно `index`.

Например:

```javascript
health.setIndex(70);

health.setEffect('poison', -20);

health.index;
// 70

health.getIndex();
// 50
```

---

## Custom calculation

Для особых случаев можно передать callback:

```javascript
health.getIndex(
    (index, effects) => {
        return index
            + (effects.blessing ?? 0) * 2
            + (effects.poison ?? 0);
    }
);
```

Callback получает:

```javascript
(index, effects)
```

Результат автоматически ограничивается `minIndex` / `maxIndex`.

---

## Изменения

`DynamicState` позволяет подписаться на изменения состояния.

```javascript
const unsubscribe =
    health.onChange(change => {
        console.log(change);
    });
```

`onChange()` возвращает функцию для удаления подписки:

```javascript
unsubscribe();
```

Изменение `index` вызывает событие:

```javascript
health.progress(-10);
```

Listener получает:

```javascript
{
    type: 'index',
    previous: 70,
    value: 60,
    state: health
}
```

---

## Изменение эффектов

Изменение эффекта также вызывает событие:

```javascript
health.setEffect(
    'poison',
    -10
);
```

Listener получает:

```javascript
{
    type: 'effect',
    name: 'poison',
    previous: undefined,
    value: -10,
    state: health
}
```

Изменение существующего эффекта:

```javascript
health.setEffect(
    'poison',
    -20
);
```

даст:

```javascript
{
    type: 'effect',
    name: 'poison',
    previous: -10,
    value: -20,
    state: health
}
```

Удаление эффекта:

```javascript
health.removeEffect('poison');
```

вызывает событие с:

```javascript
{
    type: 'effect',
    name: 'poison',
    previous: -20,
    value: undefined,
    state: health
}
```

При очистке всех эффектов используется тип:

```javascript
{
    type: 'effects',
    previous: {
        poison: -20,
        blessing: 5
    },
    value: {},
    state: health
}
```

Если новое значение совпадает со старым, событие не вызывается.

Например:

```javascript
health.setIndex(70);
health.setIndex(70);
```

второй вызов не создаст событие.

---

## Использование с другими модулями

`DynamicState` не знает ничего о других системах игры.

Например, Simulation может подписаться на изменение состояния:

```javascript
health.onChange(() => {
    npc.simulation.invalidateGroup(
        'health'
    );
});
```

Теперь изменение здоровья автоматически помечает связанные события симуляции как устаревшие.

Сам `DynamicState` при этом ничего не знает о `Simulation`.

Это позволяет использовать состояние независимо:

```text
DynamicState
    │
    └── сообщает об изменении
            │
            ▼
      Simulation
            │
            └── обновляет свои dirty events
```

---

## Render

```javascript
health.render();
// "Healthy"
```

`render()` получает актуальный индекс через `getIndex()` и ищет соответствующий диапазон.

Диапазоны задаются в формате:

```javascript
{
    '0:20': 'Critical',
    '21:50': 'Wounded',
    '51:80': 'Healthy',
    '81:100': 'Excellent'
}
```

---

## Открытые границы

Левая граница:

```javascript
{
    ':20': 'Critical',
    '21:80': 'Normal',
    '81:': 'Excellent'
}
```

Правая граница:

```text
:20  → от -∞ до 20
81:  → от 81 до +∞
```

Обе границы можно оставить открытыми:

```javascript
{
    ':0': 'Negative',
    '1:50': 'Normal',
    '51:': 'Positive'
}
```

---

## Clamp

Если заданы ограничения:

```javascript
const health = new DynamicState(
    {},
    50,
    0,
    100
);
```

значение автоматически ограничивается:

```javascript
health.setIndex(150);

health.getIndex();
// 100
```

И:

```javascript
health.setIndex(-50);

health.getIndex();
// 0
```

`clamp` применяется как к обычному `index`, так и к результату кастомного расчёта.

---

Подписчики и runtime-состояние событий в JSON не сохраняются.
