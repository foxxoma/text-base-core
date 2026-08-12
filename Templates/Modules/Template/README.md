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

### Класс: `TemplateRegistry`

Управляет несколькими шаблонами.

```js
const templates = new TemplateRegistry();

templates.createTemplate('greeting', [
    'Привет, {name}!',
    'Здравствуйте, {name}!'
]);

templates.createTemplate('farewell', [
    'До встречи, {name}!',
    'Увидимся, {name}!'
]);
```

## Случайный шаблон и Переменные

```js
template.render({
    name: 'Алексей'
});
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

## Registry

```js
templates.getTemplate('greeting');

templates.render('greeting', {
    name: 'Алексей'
});

templates.removeTemplate('greeting');

templates.clear();
```

## JSON

Сохранение:

```js
const json = templates.toJSON();
```

Восстановление:

```js
templates.fromJSON(json);
```

> `toJSON()` сохраняет только шаблоны. Функции динамических переменных в JSON не сохраняются.
