/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import * as R from "ramda";

const api = new Api();

// Pure functions
const getResult = R.prop("result");
const square = R.converge(R.multiply, [R.identity, R.identity]);
const mod3 = R.modulo(R.__, 3);
const round = R.pipe(parseFloat, Math.round);

// Validation
const isValidLength = R.both(
    R.pipe(R.length, R.lt(R.__, 10)),
    R.pipe(R.length, R.gt(R.__, 2))
);
const isPositiveNumber = R.both(
    R.pipe(parseFloat, Number.isFinite),
    R.pipe(parseFloat, R.gt(R.__, 0))
);
const isValidFormat = R.test(/^[0-9]+(?:\.[0-9]+)?$/);
const validate = R.allPass([
    isPositiveNumber,
    R.pipe(parseFloat, R.toString, isValidLength),
    isValidFormat
]);

// API calls
const getBinary = number =>
    api.get("https://api.tech/numbers/base", { from: 10, to: 2, number });
const getAnimal = remainder =>
    api.get(`https://animals.tech/${remainder}`, {});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const logStep = R.tap(writeLog);

    // Step 1
    writeLog(value);

    // Step 2
    if (!validate(value)) {
        handleError("ValidationError");
        return;
    }

    const processValue = R.pipe(
        // Step 3
        parseFloat,
        Math.round,
        logStep,
        // Step 4
        R.curryN(1, number => api.get("https://api.tech/numbers/base", { from: 10, to: 2, number })),
        R.andThen(R.pipe(
            getResult,
            logStep,
            // Step 5
            R.length,
            logStep,
            // Step 6
            square,
            logStep,
            // Step 7
            mod3,
            logStep,
            R.curryN(1, remainder => api.get(`https://animals.tech/${remainder}`, {})),
            R.andThen(getResult),
            R.andThen(handleSuccess),
            R.otherwise(handleError),
        )),
        R.otherwise(handleError),
    );

    processValue(value);
};

export default processSequence;
