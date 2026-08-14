# 🕐 Time Module — Быстрый старт

Управляемое время. Время **не идёт автоматически** и изменяется только через команды.

## Класс: `Time`

```javascript
const time = new Time();
```

### Получение

```javascript
time.minutes;      // минуты
time.hours;        // часы
time.day;          // день месяца
time.dayOfWeek;    // день недели (0–6)
time.month;        // месяц (1–12)
time.year;         // год
```

Или всё сразу:

```javascript
time.get();
```

## Перемещение

```javascript
time.skip({
    minutes: 30
});

time.skip({
    hours: 2,
    days: 1,
    weeks: 1
});

time.skip({
    months: 2,
    years: 1
});
```

## Установка

```javascript
time.set({
    year: 2026,
    month: 8,
    day: 20,
    hours: 15,
    minutes: 30
});
```

## Сброс

```javascript
time.reset();
```

Или на конкретную дату:

```javascript
time.reset(
    new Date(2026, 7, 13, 12, 0)
);
```

## JSON

```javascript
const json = time.toJSON();

time.fromJSON(json);
```

## День недели

```text
0 — Sunday
1 — Monday
2 — Tuesday
3 — Wednesday
4 — Thursday
5 — Friday
6 — Saturday
```