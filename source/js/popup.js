const cardTemplate = document.querySelector('#card').content;

const getOfferTypeLabel = function(offer) {
  let offerType;

  if (offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (offer.type === 'bungalow') {
    offerType = 'Бунгало';
  } else if (offer.type === 'house') {
    offerType = 'Дом';
  } else if (offer.type === 'palace') {
    offerType = 'Дворец';
  } else {
    throw new Error('Неизвестный тип предложения');
  }

  return offerType;
}

const getRentPopup = (rent) => {
  const offer = rent.offer;

  const popupElement = cardTemplate.cloneNode(true);

  if (offer.title) {
    popupElement.querySelector('.popup__title').textContent = offer.title;
  } else {
    popupElement.querySelector('.popup__title').classList.add('hidden');
  }

  if (offer.address) {
    popupElement.querySelector('.popup__text--address').textContent = offer.address;
  } else {
    popupElement.querySelector('.popup__text--address').classList.add('hidden');
  }

  if (offer.price) {
    popupElement.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  } else {
    popupElement.querySelector('.popup__text--price').classList.add('hidden');
  }

  if (offer.type) {
    popupElement.querySelector('.popup__type').textContent = getOfferTypeLabel(offer);
  } else {
    popupElement.querySelector('.popup__type').classList.add('hidden');
  }

  if (offer.rooms && offer.guests) {
    popupElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  } else {
    popupElement.querySelector('.popup__text--capacity').classList.add('hidden');
  }

  if (offer.checkin && offer.checkout) {
    popupElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  } else {
    popupElement.querySelector('.popup__text--time').classList.add('hidden');
  }

  if (offer.features) {
    popupElement.querySelectorAll('.popup__feature').forEach((photoFeature) => {
      photoFeature.classList.add('hidden');
    });

    offer.features.forEach((feature) => {
      popupElement.querySelector(`.popup__feature--${feature}`).classList.remove('hidden');
    });
  } else {
    popupElement.querySelector('.popup__features').classList.add('hidden');
  }

  if (offer.description) {
    popupElement.querySelector('.popup__description').textContent = offer.description;
  } else {
    popupElement.querySelector('.popup__description').classList.add('hidden');
  }

  const popupPhotos = popupElement.querySelector('.popup__photos');

  if (offer.photos) {
    offer.photos.forEach((photo) => {
      let popupPhoto = popupPhotos.querySelector('.popup__photo').cloneNode(true);

      popupPhoto.setAttribute('src', photo);

      popupPhotos.appendChild(popupPhoto);
    });

    popupPhotos.querySelector('.popup__photo').remove();
  } else {
    popupPhotos.classList.add('hidden');
  }

  if (rent.author && rent.author.avatar) {
    popupElement.querySelector('.popup__avatar').setAttribute('src', rent.author.avatar);
  } else {
    popupElement.querySelector('.popup__avatar').classList.add('hidden');
  }

  return popupElement;
}

export {getRentPopup};
