# 🎲 Random Module

Модуль для генерации случайных значений.

Поддерживает:

* случайные `float`;
* случайные `int`;
* вероятность `chance()`;
* вероятность в процентах `percent()`;
* случайный элемент `pick()`;
* взвешенный выбор `weighted()`.

## Использование

```javascript
Random.int(1, 6);

Random.float(0, 100);

Random.chance(0.25);

Random.percent(25);

Random.pick([
    'attack',
    'defend',
    'run'
]);

Random.weighted([
    ['common', 70],
    ['rare', 25],
    ['legendary', 5]
]);
```

Весы являются относительными, поэтому сумма не обязана быть `100`:

```javascript
Random.weighted([
    ['A', 1],
    ['B', 3],
    ['C', 6]
]);
```

Результат:

```text
A → 10%
B → 30%
C → 60%
```