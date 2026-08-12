
# 📊 DynamicState Module

Модуль для состояний, которые автоматически определяются по числовому `index`.

## Класс: `DynamicState`

```javascript
const health = new DynamicState('health', {
    '0:20': 'critical',
    '21:40': 'low',
    '41:70': 'normal',
    '71:100': 'high'
});
```

### Методы

```javascript
health.setIndex(50);    // Установить значение
health.progress(10);    // Увеличить
health.regress(10);     // Уменьшить

health.getIndex();      // Получить значение
health.render();        // Получить состояние
```

Пример:

```javascript
health.setIndex(35);

console.log(health.render());
// "low"
```

## Диапазоны

Поддерживаются открытые диапазоны:

```javascript
const reputation = new DynamicState('reputation', {
    ':-50': 'enemy',
    '-49:-10': 'hostile',
    '-9:10': 'neutral',
    '11:50': 'friendly',
    '51:': 'ally'
});
```

## Класс: `DynamicStateRegistry`

Для управления несколькими состояниями:

```javascript
const registry = new DynamicStateRegistry();

registry.registerState('health', {
    '0:20': 'critical',
    '21:40': 'low',
    '41:70': 'normal',
    '71:100': 'high'
});
```

### Методы

```javascript
registry.registerState(name, steps, index);
registry.getState(name);
registry.render(name);
registry.removeState(name);
registry.clear();

registry.toJSON();
registry.fromJSON(json);
```

Пример:

```javascript
registry.getState('health').progress(30);

console.log(
    registry.render('health')
);
// "low"
```

> `DynamicState` не изменяет состояние напрямую. Состояние вычисляется из `index` и заданных диапазонов при каждом вызове `render()`.
