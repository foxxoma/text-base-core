# 🎭 Declensions Module

Модуль для хранения вариантов слов/фраз в разных формах и получения случайного варианта.

## Структура классов

### Класс: `Declension`

Работа с одним набором вариантов.

```javascript
const desc = new Declension(
    ['nominative', 'genitive'],
    {
        'nominative' => nominativeVariants,
        'genitive' => genitiveVariants
    }
);

// Методы:
desc.addVariants(type, variants);       // Добавить варианты
desc.getVariants(type);                 // Получить все
desc.render(type);                      // Получить случайный
desc.removeVariant(type, variant);      // Удалить вариант
desc.removeAllVariants(type);           // Очистить тип
desc.clear();                           // Очистить всё
```

## Примеры

### Cклонения

```javascript
const beautiful = new Declension(
    'he.beautiful',
    ['nominative', 'genitive']
);

beautiful.addVariants('nominative', [
    'красивый',
    'прекрасный',
    'чудесный'
]);

beautiful.addVariants('genitive', [
    'красивого',
    'прекрасного',
    'чудесного'
]);

console.log(
    beautiful.render('nominative')
);
// "прекрасный"

console.log(
    beautiful.getVariants('genitive')
);
// ["красивого", "прекрасного", "чудесного"]

// или передать свою функцию получения ключа
beautiful.render(
    'nominative',
    variants => Random.weighted([
        [0, 10],
        [1, 3],
        [2, 1]
    ])
);
```