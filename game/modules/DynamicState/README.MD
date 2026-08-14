# 🧠 DynamicState

Числовое состояние с диапазонами и эффектами.

Поддерживает:

* `minIndex` / `maxIndex`;
* автоматический `clamp`;
* диапазоны состояний;
* именованные эффекты `name: value`;
* кастомный расчёт через callback;

## Создание

```javascript
const health = new DynamicState(
    'health',
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

## Значение

```javascript
health.setIndex(50);

health.progress(10);

health.regress(5);

health.getIndex();
```

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

и его результат автоматически ограничивается `minIndex` / `maxIndex`.

## Render

```javascript
health.render();
// "Healthy"
```

Диапазоны задаются в формате:

```javascript
{
    '0:20': 'Critical',
    '21:50': 'Wounded',
    '51:80': 'Healthy',
    '81:100': 'Excellent'
}
```

Открытые границы:

```javascript
{
    ':0': 'Critical',
    '1:50': 'Normal',
    '51:': 'High'
}
```

## Serialization

```javascript
Serializer.register(
    'DynamicState',
    DynamicState
);
```