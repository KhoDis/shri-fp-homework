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
 import Api from '../tools/api';
 import * as R from 'ramda';

 const api = new Api();

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
     writeLog(value);

     const validate = R.allPass([
         R.pipe(parseFloat, Number.isFinite),
         R.pipe(parseFloat, R.gt(R.__, 0)),
         R.pipe(parseFloat, Math.abs, R.toString, R.length, R.lt(R.__, 10)),
         R.pipe(parseFloat, Math.abs, R.toString, R.length, R.gt(R.__, 2)),
         R.test(/^[0-9]+\.?[0-9]*$/),
     ]);

     if (!validate(value)) {
         return handleError('ValidationError');
     }

     const processStep = R.curry((action, value) => {
         writeLog(value);
         return action(value);
     });

     Promise.resolve(value)
         .then(R.pipe(
             parseFloat,
             Math.round,
             processStep(R.identity)
         ))
         .then(number => api.get('https://api.tech/numbers/base', {from: 10, to: 2, number}))
         .then(R.prop('result'))
         .then(processStep(R.identity))
         .then(processStep(R.length))
         .then(processStep(R.multiply(R.__, R.__)))
         .then(processStep(R.modulo(R.__, 3)))
         .then(remainder => api.get(`https://animals.tech/${remainder}`, {}))
         .then(R.prop('result'))
         .then(handleSuccess)
         .catch(handleError);
 }

export default processSequence;
