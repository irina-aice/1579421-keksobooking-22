import {map} from './map.js';

const form = document.querySelector('.map__filters');
const formElements = form.querySelectorAll('.map__filter, fieldset');

form.classList.add('map__filters--disabled');
formElements.forEach((formElement) => {
  formElement.setAttribute('disabled', '');
});

map.addHandler('load', function() {
  form.classList.remove('map__filters--disabled');
  formElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
});
