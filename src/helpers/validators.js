/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие-либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import * as R from "ramda";

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
    R.propEq('star', 'red'),
    R.propEq('square', 'green'),
    R.propEq('triangle', 'white'),
    R.propEq('circle', 'white'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.pipe(
    R.values,
    R.filter(R.equals('green')),
    R.length,
    R.gte(2),
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.pipe(
    R.values,
    R.countBy(R.identity),
    R.applySpec({
        red: R.propOr(0, 'red'),
        blue: R.propOr(0, 'blue'),
    }),
    R.converge(R.equals, [
        R.prop('red'),
        R.prop('blue'),
    ]),
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
    R.propEq('star', 'red'),
    R.propEq('square', 'orange'),
    R.propEq('circle', 'blue'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.pipe(
    R.values,
    R.reject(R.equals('white')),
    R.countBy(R.identity),
    R.values,
    R.any(R.gte(R.__, 3)),
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([
    R.pipe(R.values, R.filter(R.equals('green')), R.length, R.equals(2)),
    R.propEq('triangle', 'green'),
    R.pipe(R.values, R.filter(R.equals('red')), R.length, R.equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.pipe(
    R.values,
    R.filter(R.equals('orange')),
    R.length,
    R.equals(4),
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.pipe(
    R.prop('star'),
    R.allPass([
        R.complement(R.equals('red')),
        R.complement(R.equals('white')),
    ]),
)

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.pipe(
    R.values,
    R.filter(R.equals('green')),
    R.length,
    R.equals(4),
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
    R.converge(R.equals, [
        R.prop('triangle'),
        R.prop('square'),
    ]),
    R.pipe(R.prop('triangle'), R.complement(R.equals('white'))),
    R.pipe(R.prop('square'), R.complement(R.equals('white'))),
]);
