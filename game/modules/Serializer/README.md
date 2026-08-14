# 💾 Serializer Module

Универсальный сериализатор для сохранения и восстановления состояния приложения.

Поддерживает:

- обычные объекты;
- массивы;
- `Set`;
- `Map`;
- `Date`;
- `BigInt`;
- `undefined`;
- `NaN`;
- `Infinity`;
- зарегистрированные классы;
- вложенные классы;
- `toJSON()` / `fromJSON()`;
- factory для сложных классов.

## Регистрация

Класс необходимо зарегистрировать, если он должен восстанавливаться как экземпляр класса.

```javascript
Serializer.register('DynamicState', DynamicState);
Serializer.register('Template', Template);
Serializer.register('Declension', Declension);
Serializer.register('Time', Time);