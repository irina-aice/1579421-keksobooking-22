import {map, renderMarkers} from './map.js';

let rents;
const RENTS_COUNT = 10;
const form = document.querySelector('.map__filters');
const formElements = form.querySelectorAll('.map__filter, fieldset');
const housingTypeSelect = form.querySelector('#housing-type');
const housingPriceSelect = form.querySelector('#housing-price');
const housingRoomsSelect = form.querySelector('#housing-rooms');
const housingGuestsSelect = form.querySelector('#housing-guests');
const housingFeaturesCheckboxList = form.querySelectorAll('.map__checkbox');

const SELECT_ANY = 'any';

form.classList.add('map__filters--disabled');
formElements.forEach((formElement) => {
  formElement.setAttribute('disabled', '');
});

const filterCallback = function () {
  let filteredRents;
  const housingRoomsValue = +housingRoomsSelect.value;
  const housingGuestsValue = +housingGuestsSelect.value;

  filteredRents = rents.filter((rent, i) => {
    if (i >= RENTS_COUNT) {
      return false;
    }

    const features = rent.offer.features;
    let isValidOffer = true;
    let price = rent.offer.price;

    if (housingTypeSelect.value !== SELECT_ANY) {
      if (rent.offer.type !== housingTypeSelect.value) {
        isValidOffer = false;
      }
    }

    if (housingPriceSelect.value !== SELECT_ANY) {
      if (housingPriceSelect.value === 'middle' && (price < 10000 || price > 50000)) {
        isValidOffer = false;
      } else if (housingPriceSelect.value === 'low' && price >= 10000) {
        isValidOffer = false;
      } else if (housingPriceSelect.value === 'high' && price <= 50000) {
        isValidOffer = false;
      }
    }

    if (housingRoomsSelect.value !== SELECT_ANY) {
      if (rent.offer.rooms !== housingRoomsValue) {
        isValidOffer = false;
      }
    }

    if (housingGuestsSelect.value !== SELECT_ANY) {
      if (rent.offer.guests !== housingGuestsValue) {
        isValidOffer = false;
      }
    }

    housingFeaturesCheckboxList.forEach((checkbox) => {
      if (checkbox.checked) {
        let isValidFeature = false;

        features.forEach((feature) => {
          if (feature === checkbox.value) {
            isValidFeature = true;
          }
        });

        if (!isValidFeature) {
          isValidOffer = false;
        }
      }
    });

    return isValidOffer;
  });

  renderMarkers(filteredRents);
}

map.on('load-all-data', (data) => {
  rents = data.rents;

  form.classList.remove('map__filters--disabled');
  formElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });

  filterCallback();
});

housingTypeSelect.addEventListener('change', filterCallback);

housingPriceSelect.addEventListener('change', filterCallback);

housingRoomsSelect.addEventListener('change', filterCallback);

housingGuestsSelect.addEventListener('change', filterCallback);

housingFeaturesCheckboxList.forEach((checkbox) => {
  checkbox.addEventListener('change', filterCallback);
});
