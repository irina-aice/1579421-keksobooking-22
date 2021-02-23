import {map} from './map.js';

const form = document.querySelector('.ad-form');
const formElements = form.querySelectorAll('fieldset');
const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const timeinSelect = document.querySelector('#timein');
const timeoutSelect = document.querySelector('#timeout');
const roomNumberSelect = document.querySelector('#room_number');
const capacitySelect = document.querySelector('#capacity');

form.classList.add('ad-form--disabled');
formElements.forEach((formElement) => {
  formElement.setAttribute('disabled', '');
});

typeSelect.addEventListener('change', () => {
  let placeholder;
  let min;

  if (typeSelect.value === 'bungalow') {
    placeholder = '0';
    min = 0;
  } else if (typeSelect.value === 'flat') {
    placeholder = '1000';
    min = 1000;
  } else if (typeSelect.value === 'house') {
    placeholder = '5000';
    min = 5000;
  } else if (typeSelect.value === 'palace') {
    placeholder = '10000';
    min = 10000;
  }

  priceInput.placeholder = placeholder;
  priceInput.setAttribute('min', min);
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

const checkCapacity = function () {
  let customValidityMessage = '';

  if (roomNumberSelect.value === '1') {
    if (capacitySelect.value === '1') {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 1 комнаты допустимое кол-во мест "для 1 гостя"';
    }
  } else if (roomNumberSelect.value === '2') {
    if (capacitySelect.value === '1' || capacitySelect.value === '2') {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 2 комнат допустимое кол-во мест "для 1 гостя" или "для 2 гостей"';
    }
  } else if (roomNumberSelect.value === '3') {
    if (capacitySelect.value === '1' || capacitySelect.value === '2' || capacitySelect.value === '3') {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 3 комнат допустимое кол-во мест "для 1 гостя" или "для 2 гостей" или "для 3 гостей"';
    }
  } else if (roomNumberSelect.value === '100') {
    if (capacitySelect.value === '0') {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 100 комнат допустимое кол-во мест "не для гостей"';
    }
  }

  capacitySelect.setCustomValidity(customValidityMessage);
}

checkCapacity();

roomNumberSelect.addEventListener('change', checkCapacity);
capacitySelect.addEventListener('change', checkCapacity);


