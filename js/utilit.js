const getRandom = function (min, max, precision = 0) {
  if (min < 0 || max < 0) {
    throw new Error('Числа должны быть больше или равны 0');
  }

  if (min > max || min === max) {
    throw new Error('Числа не должны быть равны друг другу и максимальное число должно быть больше минимального');
  }

  if (!precision) {
    //https://learn.javascript.ru/number#sluchaynoe-tseloe-chislo-ot-min-do-max
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  //https://learn.javascript.ru/number#sluchaynoe-tseloe-chislo-ot-min-do-max
  let rand = min + Math.random() * (max - min);
  return +rand.toFixed(precision);
}

const getRandomArrayElement = function (elements) {
  return elements[getRandom(0, elements.length - 1)];
};

export {getRandom, getRandomArrayElement};
