# 📊 DynamicState Module

Модуль для создания состояний, зависящих от числового значения.

### `DynamicState`

```javascript
const health = new DynamicState('health', {
    '0:20': 'critical',
    '21:40': 'low',
    '41:70': 'normal',
    '71:100': 'high'
}, 80, 0, 100);
```

### Основные методы

```javascript
health.setIndex(50);     // Установить значение
health.getIndex();       // Получить текущее значение
health.progress(10);     // Увеличить значение
health.regress(10);      // Уменьшить значение
health.render();         // Получить состояние

health.setDebuff(20);   // Установить debuff
health.unsetDebuff();   // Убрать debuff
```

`debuff` влияет на значение только при получении через `getIndex()`:

```javascript
health.setIndex(80);
health.setDebuff(20);

health.getIndex(); // 60
health.render();   // "normal"
```

### Диапазоны

Можно использовать открытые диапазоны:

```javascript
const reputation = new DynamicState('reputation', {
    ':-50': 'enemy',
    '-49:-10': 'hostile',
    '-9:10': 'neutral',
    '11:50': 'friendly',
    '51:': 'ally'
});
```