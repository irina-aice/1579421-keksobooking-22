/* global _:readonly */
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

const priceValues = {
  low: 10000,
  high: 50000,
}

const housingPriceValues = {
  middle: 'middle',
  low: 'low',
  high: 'high',
};

const filterCallback = function () {
  let filteredRents = [];
  const housingRoomsValue = +housingRoomsSelect.value;
  const housingGuestsValue = +housingGuestsSelect.value;

  for (let i = 0; i < rents.length; i++) {
    const rent = rents[i];

    const features = rent.offer.features;
    let isValidFeatures = true;
    let price = rent.offer.price;

    if (housingTypeSelect.value !== SELECT_ANY) {
      if (rent.offer.type !== housingTypeSelect.value) {
        continue;
      }
    }

    if (housingPriceSelect.value !== SELECT_ANY) {
      if (housingPriceSelect.value === housingPriceValues.middle && (price < priceValues.low || price > priceValues.high)) {
        continue;
      } else if (housingPriceSelect.value === housingPriceValues.low && price >= priceValues.low) {
        continue;
      } else if (housingPriceSelect.value === housingPriceValues.high && price <= priceValues.high) {
        continue;
      }
    }

    if (housingRoomsSelect.value !== SELECT_ANY) {
      if (rent.offer.rooms !== housingRoomsValue) {
        continue;
      }
    }

    if (housingGuestsSelect.value !== SELECT_ANY) {
      if (rent.offer.guests !== housingGuestsValue) {
        continue;
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
          isValidFeatures = false;
        }
      }
    });

    if (!isValidFeatures) {
      continue;
    }

    filteredRents.push(rent);

    if (filteredRents.length >= RENTS_COUNT) {
      break;
    }
  }

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

map.on('adv-form-submitted', () => {
  form.reset();
  filterCallback();
});

let debouncedFilterCallback =  _.debounce(filterCallback, 500);

housingTypeSelect.addEventListener('change', debouncedFilterCallback);

housingPriceSelect.addEventListener('change', debouncedFilterCallback);

housingRoomsSelect.addEventListener('change', debouncedFilterCallback);

housingGuestsSelect.addEventListener('change', debouncedFilterCallback);

housingFeaturesCheckboxList.forEach((checkbox) => {
  checkbox.addEventListener('change', debouncedFilterCallback);
});
