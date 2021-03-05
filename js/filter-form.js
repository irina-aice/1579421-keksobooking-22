import {map, renderMarkers} from './map.js';

let rents;
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

map.on('load-all-data', (data) => {
  rents = data.rents;

  form.classList.remove('map__filters--disabled');
  formElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
});

const formChanged = function () {
  let filteredRents = rents;
  const housingRoomsValue = +housingRoomsSelect.value;
  const housingGuestsValue = +housingGuestsSelect.value;


  if (housingTypeSelect.value !== SELECT_ANY) {
    filteredRents = filteredRents.filter((rent) => {
      let result = false;

      if (rent.offer.type === housingTypeSelect.value) {
        result = true;
      }

      return result;
    });
  }

  if (housingPriceSelect.value !== SELECT_ANY) {
    filteredRents = filteredRents.filter((rent) => {
      let price = rent.offer.price;
      let result = false;

      if (housingPriceSelect.value === 'middle' && price >= 10000 && price <= 50000) {
        result = true;
      } else if (housingPriceSelect.value === 'low' && price < 10000) {
        result = true;
      } else if (housingPriceSelect.value === 'high' && price > 50000) {
        result = true;
      }

      return result;
    });
  }


  if (housingRoomsSelect.value !== SELECT_ANY) {
    filteredRents = filteredRents.filter((rent) => {
      let result = false;

      if (rent.offer.rooms === housingRoomsValue) {
        result = true;
      }

      return result;
    })
  }

  if (housingGuestsSelect.value !== SELECT_ANY) {
    filteredRents = filteredRents.filter((rent) => {
      let result = false;

      if (rent.offer.guests === housingGuestsValue) {
        result = true;
      }

      return result;
    });
  }

  housingFeaturesCheckboxList.forEach((checkbox) => {
    if (checkbox.checked) {
      filteredRents = filteredRents.filter((rent) => {
        let result = false;
        const features = rent.offer.features;

        features.forEach((feature) => {
          if (checkbox.value === feature) {
            result = true;
          }
        });

        return result;
      });
    }
  });

  renderMarkers(filteredRents);
}

housingTypeSelect.addEventListener('change', formChanged);

housingPriceSelect.addEventListener('change', formChanged);

housingRoomsSelect.addEventListener('change', formChanged);

housingGuestsSelect.addEventListener('change', formChanged);

housingFeaturesCheckboxList.forEach((checkbox) => {
  checkbox.addEventListener('change', formChanged);
});
