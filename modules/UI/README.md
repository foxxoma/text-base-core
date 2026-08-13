# UI Module

Минимальный слой состояния интерфейса.

`UI` хранит контент по ключам и не знает ничего о DOM.

```javascript
const ui = new UI();

ui.set('location', 'Таверна');

ui.setMany({
    text: 'Вы входите в таверну.',
    status: 'Здоровье: 100'
});
```

## DOMUI

`DOMUI` связывает ключи `UI` с DOM-элементами.

HTML:

```html
<div data-ui="location"></div>
<div data-ui="text"></div>
<div data-ui="status"></div>
```

JS:

```javascript
const ui = new UI();
const domUI = new DOMUI(ui);

domUI.set('location', 'Таверна');
domUI.set('text', 'Вы входите внутрь.');
domUI.set('status', 'Здоровье: 100');
```

Для существующего состояния:

```javascript
ui.setMany({
    location: 'Таверна',
    text: 'Вы входите внутрь.'
});

domUI.renderAll();
```

### Принцип

```text
Game → UI → DOMUI → DOM
```

`UI` отвечает за состояние.

`DOMUI` отвечает только за отображение этого состояния.