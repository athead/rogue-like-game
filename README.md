# Rogue Knight
## _Тестовое задание на позицию фронтенд разработчика_

Задание интересное, старался придерживаться ES5, но очень не хотелось))

[DEMO](https://athead.github.io/rogue-like-game/) - GitHub pages

## Фичи
- Все по ТЗ +
- Реализован простой AI (противники ищут и атакуют героя, если он рядом)
- Реализован инвентарь
- Простое отображение HP и атаки
- Генератор проходов следит за тем, чтобы проходы "не слипались"
- Добавил приветственный экран и сообщение о результатах игры

## Применял
- DRY
- CODE-SPLITTING (хотя еще есть где разбить)
- Комментировал на англ. языке
- Старался написать функции таким образом, чтобы div'ы не перерисовывались лишний раз

## Что можно еще сделать
- Плавную анимацию
- Сложность
- Немного доработать алгоритм атаки героя (чтобы противники могли обходить стены)

## Проблемы
- Столкнулся с нюансом псевдогенерации чисел (экстремумы выпадают в 2 раза реже), расширил генератор +1
