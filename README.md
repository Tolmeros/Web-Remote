# Web-Remote

# Початкові налаштування
1. Підєднатись до WIFI точки доступу Wemos**AABBCCDDEEFF** (AABBCCDDEEFF - серійний номер вашої плати)
2. Перейти в Google Chrome на сторінку 192.168.4.1
3. У меню Google Chrome вибрати пункт - **додати на початковий екран**. На робочому столі створиться ярлик для швидкого запуску додатка.

# Схема

![Схема](/tools/img/schematic.jpg)

# Зовнішній вигляд інтерфейсу користувача

## Сторінка налаштувань
![Сторінка налаштувань](/tools/img/1-settings.png)

## Інтерфейс (All-In-One)
![Інтерфейс (All-In-One)](/tools/img/2-all-in-one.png)

## Місце водія
![Місце водія](/tools/img/3-driver.png)

## Місце снайпера
![Місце снайпера](/tools/img/4-sniper.png)

## Налаштування WIFI
![Налаштування WIFI](/tools/img/5-wifi-config.png)

## Налаштування двигуна
![Налаштування двигуна](/tools/img/6-engine.png)

## Налаштування диогенератора
![Налаштування диогенератора](/tools/img/7-smoke.png)

## Налаштування кабіни
![Налаштування кабіни](/tools/img/8-tank-turrent.png)

## Налаштування ствола
![Налаштування ствола](/tools/img/9-barel.png)





## Структура проекту
1. **HTML-Remote** - C# MVC проект для відлагодки HTML інтерфейсу та випробування різного роду технологій, які потім мігрують в ESP. Проект повністю повторяє функціонал ESP прошивки і розширює його (тільк в плані тестового іункціоналу)
  * З допомогою **bundleconfig.json** налаштована склейка та мініфікація скриптів, стилів та HTML файлів у підпапку **data**
  * З підпапки **data** файли копіюються (у WebRemote/data) вручну (можливо потім автоматизую цей процес....)
2. **WebRemote** - C++ проект прошивки ESP8266. Директорія data - містить HTML мініфіковіні файли
## Events API
### Протокол комунікації
1. Викликаємо GET api/EventSourceName. Метод повертає Route (адресу джерела івентів) по якому транслюється інформація з сервера на web-UI. Одним із параметів є DI клієнта
2. POST в контроллер **api** - Надсилаємо пакет з форматом даних **format:{fields:[field1, field2, field, ... fieldN]}\n**. Цього формату має притримуватись додаток при комунікації з приладом, і в такому ж форматі має відровідати прилад. (це для того, щоб мінімізувати трафік і одночасно забезпечити підтримку стрих версій додатку у яких може бути інша конфігурація елементів керування)
4. По Event source каналу отримуємо від прилада масив значень і розставляємо їх по елементах керування у відповідності до обговореного формату
5. Якщо користувач змінив якийсь параметр - надсилаємо приладу пакет у обговореному наперед форматі. (Повертаємось до п4)
6. Якщо звязок втрачено - гасимо лампочку **Connected**. Запускаємо зворотній відлік на 3 секнди і пробуємо відновити звязок (Повертаємось до п1)
### Формат пакету
```javascript
{
  client:"random string id of client"
  format:[field1, field2, field, ... fieldN],
  values:['v1', 'v2', 'v3', .. 'vN']
};
```

