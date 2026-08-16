# Simulation

Модуль для выбора событий сущности по **динамическим весам**.

Simulation отделяет:

* **описание поведения** — общая `Simulation`;
* **runtime-состояние конкретной сущности** — `SimulationInstance`;
* **условия доступности** — группы;
* **пересчёт весов** — dirty keys.

Это позволяет использовать один набор правил для большого количества NPC, не создавая копии функций событий для каждого NPC.

---

## Архитектура

```text
Simulation
│
├── events
│   ├── work
│   ├── eat
│   ├── sleep
│   └── attack
│
├── groups
│   ├── time
│   ├── needs
│   └── combat
│
└── create(entity)
        │
        ├── SimulationInstance #1
        │     ├── weights
        │     └── dirtyKeys
        │
        ├── SimulationInstance #2
        │     ├── weights
        │     └── dirtyKeys
        │
        └── SimulationInstance #3
              ├── weights
              └── dirtyKeys
```

`Simulation` является общей.

`SimulationInstance` принадлежит конкретной сущности.

---

# Simulation

Создание:

```js
const npcSimulation =
    new Simulation();
```

## Регистрация события

```js
npcSimulation.event(
    'work',

    npc => {
        if (!npc.hasJob()) {
            return 0;
        }

        return npc.world.time.isWorkingTime()
            ? 100
            : 0;
    },

    ['work', 'time']
);
```

Сигнатура:

```js
simulation.event(
    key,
    weight,
    groups
);
```

### key

Уникальный идентификатор события.

```js
'work'
'eat'
'sleep'
```

### weight

Функция, возвращающая вес события.

```js
npc => 100
```

`0` означает, что событие недоступно.

Положительное значение означает вес события при случайном выборе.

Например:

```text
work = 100
eat  = 30
sleep = 10
```

Событие `work` будет выбираться примерно в 10 раз чаще, чем `sleep`.

Вес может полностью зависеть от состояния сущности:

```js
npc => npc.hunger
```

---

# Groups

Группа — это **не условие события**.

Она используется для объединения событий и ограничения набора событий при выборе.

Например:

```js
simulation.event(
    'attack',
    npc => 100,
    ['combat']
);

simulation.event(
    'flee',
    npc => 50,
    ['combat', 'danger']
);
```

Одно событие может принадлежать нескольким группам.

```text
attack → combat
flee   → combat, danger
```

---

# Создание экземпляра

Общая Simulation создаётся один раз:

```js
const npcSimulation =
    new Simulation();
```

Для каждого NPC создаётся собственный instance:

```js
npc.simulation =
    npcSimulation.create(npc);
```

У каждого NPC теперь собственные:

```text
weights
dirtyKeys
```

но общие функции событий.

---

# SimulationInstance

Instance отвечает за состояние симуляции конкретной сущности.

## Выбор события

```js
const event =
    npc.simulation.next();
```

Возвращается ключ:

```js
'work'
```

или:

```js
'eat'
```

Если доступных событий нет:

```js
null
```

---

# Ограничение групп

Можно временно ограничить выбор определёнными группами:

```js
npc.simulation.next([
    'combat'
]);
```

В этом случае события вне `combat` не участвуют в выборе.

Можно передать несколько групп:

```js
npc.simulation.next([
    'combat',
    'danger'
]);
```

Событие считается доступным, если оно принадлежит **хотя бы одной** указанной группе.

Например:

```text
attack → combat
flee   → combat, danger
hide   → danger
```

При:

```js
next(['combat'])
```

доступны:

```text
attack
flee
```

При:

```js
next(['danger'])
```

доступны:

```text
flee
hide
```

---

# Dirty events

Вес события не пересчитывается постоянно.

После расчёта его значение хранится в:

```js
weights
```

Если состояние сущности изменилось, соответствующее событие нужно пометить грязным:

```js
npc.simulation.invalidateEvent(
    'eat'
);
```

При следующем:

```js
npc.simulation.next();
```

грязное событие будет автоматически пересчитано.

---

# Локальная инвалидизация

Изменился голод конкретного NPC:

```js
npc.hunger = 80;

npc.simulation.invalidateEvent(
    'eat'
);
```

Другие NPC не затрагиваются.

Можно инвалидировать несколько событий:

```js
npc.simulation.invalidateKeys([
    'eat',
    'hunt'
]);
```

Или всю группу:

```js
npc.simulation.invalidateGroup(
    'needs'
);
```

---

# Глобальная инвалидизация

Если изменение касается всех NPC, используется общая Simulation.

Например, наступил новый час:

```js
npcSimulation.invalidateGroup(
    'time'
);
```

Simulation пометит соответствующие события грязными у всех созданных экземпляров.

При этом веса **не пересчитываются сразу**.

Они будут пересчитаны только при следующем обращении к конкретному NPC:

```js
npc.simulation.next();
```

Это позволяет не пересчитывать всех NPC, если большая часть из них в данный момент не используется.

---

# Полный refresh

Если нужно пересчитать всё состояние конкретного NPC:

```js
npc.simulation.invalidateAll();

npc.simulation.refresh();
```

`refresh()` пересчитывает только dirty events.

---

# Пример

```js
const npcSimulation =
    new Simulation();

npcSimulation

    .event(
        'work',

        npc => {
            if (!npc.hasJob()) {
                return 0;
            }

            return npc.world.time.isWorkingTime()
                ? 100
                : 0;
        },

        ['work', 'time']
    )

    .event(
        'eat',

        npc => npc.hunger,

        ['needs']
    )

    .event(
        'sleep',

        npc => {
            return npc.energy < 30
                ? 100
                : 0;
        },

        ['needs', 'time']
    )

    .event(
        'attack',

        npc => npc.enemy
            ? 100
            : 0,

        ['combat']
    );
```

Создание NPC:

```js
const npc = new NPC();

npc.simulation =
    npcSimulation.create(npc);
```

Выбор обычного действия:

```js
const event =
    npc.simulation.next();
```

Выбор боевого действия:

```js
const event =
    npc.simulation.next([
        'combat'
    ]);
```

NPC проголодался:

```js
npc.hunger += 20;

npc.simulation.invalidateEvent(
    'eat'
);
```

Наступил новый час:

```js
npcSimulation.invalidateGroup(
    'time'
);
```

NPC получил приказ атаковать:

```js
const event =
    npc.simulation.next([
        'combat'
    ]);
```

---

# Основная идея

Simulation не принимает решения за NPC.

Она только отвечает на вопрос:

> Какие события сейчас возможны и с каким весом они должны участвовать в случайном выборе?

Сущность сама решает, **когда** запрашивать новое событие и **что делать** с полученным ключом.

```text
NPC
 │
 │ состояние изменилось
 ▼
invalidateEvent()
 │
 ▼
dirtyKeys
 │
 │ следующий запрос
 ▼
next()
 │
 ├── пересчитать dirty events
 │
 ├── применить group-фильтр
 │
 └── выбрать по весам
 │
 ▼
'work'
 │
 ▼
NPC обрабатывает событие
```

Такой подход позволяет держать сложную логику поведения отдельно от классов NPC и при этом не превращать Simulation в глобальную систему, которая постоянно пересчитывает всех персонажей.
