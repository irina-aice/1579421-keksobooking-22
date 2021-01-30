//Функция, возвращающая случайное целое число из переданного диапазона включительно
const getRandomInteger = function (min, max) {
  if (min < 0 || max < 0) {
    alert('error');
    return;
  }

  if (min > max || min === max) {
    alert('error');
    return;
  }

  //https://learn.javascript.ru/number#sluchaynoe-tseloe-chislo-ot-min-do-max
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
getRandomInteger(10, 11);


//Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно
const getRandomFloat = function (min, max, precision) {
  if (min < 0 || max < 0) {
    alert('error');
    return;
  }

  if (min > max || min === max) {
    alert('error');
    return;
  }

  //https://learn.javascript.ru/number#sluchaynoe-tseloe-chislo-ot-min-do-max
  let rand = min + Math.random() * (max - min);
  return +rand.toFixed(precision);
}
getRandomFloat(1.1, 1.2, 2);
