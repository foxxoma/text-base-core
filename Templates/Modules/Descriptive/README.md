# 🎭 Declensions Module

Модуль для хранения вариантов слов/фраз в разных формах и получения случайного варианта.

## Структура классов

### Класс: `Declension`

Работа с одним набором вариантов.

```javascript
const desc = new Declension(
    'he.beautiful',
    ['nominative', 'genitive']
);

// Методы:
desc.addVariants(type, variants);       // Добавить варианты
desc.getVariants(type);                 // Получить все
desc.render(type);                      // Получить случайный
desc.removeVariant(type, variant);      // Удалить вариант
desc.removeAllVariants(type);           // Очистить тип
desc.clear();                           // Очистить всё
```

### Класс: `DeclensionRegistry`

Управление несколькими `Declension`.

```javascript
const registry = new DeclensionRegistry();

// Методы:
registry.createDeclension(name, types); // Создать
registry.getDeclension(name);           // Получить
registry.removeDeclension(name);        // Удалить
registry.clear();                       // Очистить всё

registry.toJSON();                      // Сохранить
registry.fromJSON(json);                // Загрузить
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
```

### С Registry

```javascript
const registry = new DeclensionRegistry();

registry.createDeclension(
    'hero',
    ['nominative', 'genitive']
);

registry.createDeclension(
    'enemy',
    ['nominative', 'genitive']
);

const hero = registry.getDeclension('hero');
const enemy = registry.getDeclension('enemy');

hero.addVariants('nominative', [
    'герой',
    'боец',
    'витязь'
]);

hero.addVariants('genitive', [
    'героя',
    'бойца',
    'витязя'
]);

enemy.addVariants('nominative', [
    'враг',
    'противник'
]);

enemy.addVariants('genitive', [
    'врага',
    'противника'
]);

const h = hero.render('nominative');
const e = registry.render('enemy', 'genitive');

console.log(
    `${h} готов к бою против ${e}`
);
// "боец готов к бою против противника"
```


## JSON

Сохранение:

```js
const json = registry.toJSON();
```

Восстановление:

```js
registry.fromJSON(json);
```
