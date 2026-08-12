# 🎭 Declensions Module - Быстрый старт

## Файлы проекта

- **Declension.js** - основной модуль с классами

## Структура классов

### Класс: Declension

Для работы с одним описанием и его вариантами.

```javascript
const desc = new Declension('название', ['type1', 'type2', 'type3']);

// Методы:
desc.addVariants(type, variants);      // Добавить варианты
desc.getVariants(type);                // Получить все варианты
desc.getRandom(type);                  // Получить случайный
desc.removeVariant(type, variant);     // Удалить конкретный
desc.removeAllVariants(type);          // Очистить тип
desc.clear();                          // Полностью очистить
```

### Класс: DeclensionRegistry

Для управления несколькими Declension'ами.

```javascript
const registry = new DeclensionRegistry();

// Методы:
registry.createDeclension(name, types);  // Создать
registry.getDeclension(name);            // Получить
registry.removeDeclension(name);         // Удалить

registry.toJSON();                       // JSON
registry.fromJSON(name);
```

## Примеры использования

### Пример 1: Простое использование

```javascript
const beautiful = new Declension('he.beautiful', ['nominative', 'genitive']);
beautiful.addVariants('nominative', ['красивый', 'прекрасный', 'чудесный']);
beautiful.addVariants('genitive', ['красивого', 'прекрасного', 'чудесного']);

console.log(beautiful.getRandom('nominative'));  // 'прекрасный'
console.log(beautiful.getVariants('genitive'));  // ['красивого', ...]
```

### Пример 2: С менеджером

```javascript
const registry = new DeclensionRegistry();

// Создаём переменные
registry.createDeclension('hero', ['nominative', 'genitive']);
registry.createDeclension('enemy', ['nominative', 'genitive']);

// Заполняем
const hero = registry.getDeclension('hero');
hero.addVariants('nominative', ['герой', 'боец', 'витязь']);
hero.addVariants('genitive', ['героя', 'бойца', 'витязя']);

const enemy = registry.getDeclension('enemy');
enemy.addVariants('nominative', ['враг', 'противник']);
enemy.addVariants('genitive', ['врага', 'противника']);

// Используем
const h = hero.getRandom('nominative');
const e = enemy.getRandom('genitive');
console.log(`${h} готов к бою против ${e}`);  // "боец готов к бою против противника"
```

## Обработка ошибок

```javascript
try {
    const word = new Declension('тест', ['type1']);
    word.getRandom('type1');  // Ошибка! type1 пуст
} catch (error) {
    console.error(error.message);
    // "No variants available for type type1."
}

try {
    word.addVariants('invalidType', ['вариант']);  // Ошибка! invalidType не существует
} catch (error) {
    console.error(error.message);
    // "Declension type invalidType is not valid."
}
```