import {getRandom, getRandomArrayElement} from './utilit.js';

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
];

const HOURS = [
  '12:00',
  '13:00',
  '14:00',
];

const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];



//генерирование объекта author
const getAuthor = function () {
  return {
    avatar: `img/avatars/user0${getRandom(1, 8)}.png`,
  };
};

//генерирование объекта location
const getLocation = function () {
  return {
    x: getRandom(35.65000, 35.70000, 5),
    y: getRandom(139.70000, 139.80000, 5),
  }
};

//генерирование объекта offer
const getOffer = function (location = getLocation()) {
  const similarFeatures = new Array(getRandom(1, 6)).fill(null).map(() => getRandomArrayElement(FEATURES));
  const similarPhotos = new Array(getRandom(1, 3)).fill(null).map(() => getRandomArrayElement(PHOTOS));
  const unique = function (array) {
    const result = [];

    for (let string of array) {
      if (!result.includes(string)) {
        result.push(string);
      }
    }

    return result;
  }

  return {
    title: 'Качественно и недорого!',
    address: location.x + ', ' + location.y,
    price: getRandom(0, 1000000),
    type: getRandomArrayElement(TYPES),
    rooms: getRandom(0, 1000000),
    guests: getRandom(0, 1000000),
    checkin: getRandomArrayElement(HOURS),
    checkout: getRandomArrayElement(HOURS),
    features: unique(similarFeatures),
    description: 'Потрясающий вид, расположен в тихом месте в центре города.',
    photos: unique(similarPhotos),
  };
};

//создание массива
const rents = [];

for (let i = 0; i < 10; i++) {
  const location = getLocation();
  const author = getAuthor();
  const offer = getOffer(location);

  rents.push({
    author: author,
    offer: offer,
    location: location,
  });
}

export {rents, getOffer, getAuthor, getLocation};
