# 🎭 Template Module
Модуль для создания текстовых шаблонов со случайным выбором вариантов и динамическими переменными.

## Структура классов

### Класс: `Template`

Хранит несколько вариантов одного шаблона.

```js
const template = new Template('greeting', [
    'Привет, {name}!',
    'Здравствуйте, {name}!',
    'Рад тебя видеть, {name}!'
]);
```

## Случайный шаблон и Переменные

```js
template.render({
    name: 'Алексей'
});

// или передать свою функцию получения ключа
template.render(
    {
        name: 'Алексей'
    },
    (variants) => Random.weighted([
        [0, 10],
        [1, 3],
        [2, 1]
    ])
);
```

Для:

```text
Привет, {name}!
```

получим:

```text
Привет, Алексей!
```

## Динамические переменные

Функция получает индекс выбранного шаблона:

```js
template.render({
    name: (templateIndex) => {
        return declension.getRandom(
            templateIndex === 0
                ? 'accusative'
                : 'dative'
        );
    }
});
```

Это позволяет использовать `Template` вместе с `Declension`, при этом `Template` не зависит от него напрямую.

## Управление вариантами

```js
template.addVariants([
    'Добрый день, {name}!'
]);

template.getVariants();

template.removeVariant(
    'Добрый день, {name}!'
);

template.removeAllVariants();

template.clear();
```
