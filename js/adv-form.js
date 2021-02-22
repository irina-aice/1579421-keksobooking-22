import {map} from './map.js';

const form = document.querySelector('.ad-form');
const formElements = form.querySelectorAll('fieldset');
const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const timeinSelect = document.querySelector('#timein');
const timeoutSelect = document.querySelector('#timeout');

form.classList.add('ad-form--disabled');
formElements.forEach((formElement) => {
  formElement.setAttribute('disabled', '');
});

typeSelect.addEventListener('change', () => {
  let placeholder;

  if (typeSelect.value === 'bungalow') {
    placeholder = '0';
  } else if (typeSelect.value === 'flat') {
    placeholder = '1000';
  } else if (typeSelect.value === 'house') {
    placeholder = '5000';
  } else if (typeSelect.value === 'palace') {
    placeholder = '10000';
  }

  priceInput.placeholder = placeholder;
});

timeinSelect.addEventListener('change', () => {
  timeoutSelect.value = timeinSelect.value;
});

timeoutSelect.addEventListener('change', () => {
  timeinSelect.value = timeoutSelect.value;
});

map.addHandler('load', function () {
  form.classList.remove('ad-form--disabled');

  formElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
})
