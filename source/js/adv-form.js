import {map} from './map.js';
import {sendAdvForm} from './fetch.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const form = document.querySelector('.ad-form');
const formElements = form.querySelectorAll('fieldset');
const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const timeinSelect = document.querySelector('#timein');
const timeoutSelect = document.querySelector('#timeout');
const roomNumberSelect = document.querySelector('#room_number');
const capacitySelect = document.querySelector('#capacity');
const resetButton = document.querySelector('.ad-form__reset');
const avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
const avatarPreview = document.querySelector('.ad-form-header__preview img');
const photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');
const photoPreview = document.querySelector('.ad-form__photo');

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

const resetForm = function() {
  form.reset();
  checkCapacity();
  map.fire('adv-form-submitted');
}

const fetchOnSuccess = function() {
  const main = document.querySelector('main');
  const successTemplate = document.querySelector('#success').content.cloneNode(true);
  const successBlock = successTemplate.querySelector('.success');

  main.appendChild(successTemplate);

  const closeSuccessPopup = function () {
    successBlock.classList.add('visually-hidden');

    successBlock.removeEventListener('click', onSuccessBlockClickHandler);
    window.removeEventListener('keydown', onSuccessPopupEscKeydownHandler);
  }

  const onSuccessBlockClickHandler = function () {
    closeSuccessPopup();
  }

  const onSuccessPopupEscKeydownHandler = function (evt) {
    if (evt.code === 'Escape') {
      closeSuccessPopup();
    }
  }

  successBlock.addEventListener('click', onSuccessBlockClickHandler);
  window.addEventListener('keydown', onSuccessPopupEscKeydownHandler);

  resetForm();
};

const fetchOnError = function() {
  const main = document.querySelector('main');
  const errorTemplate = document.querySelector('#error').content.cloneNode(true);
  const errorBlock = errorTemplate.querySelector('.error');
  const errorButton = errorTemplate.querySelector('.error__button');

  main.appendChild(errorTemplate);

  const closeErrorPopup = function () {
    errorBlock.classList.add('visually-hidden');

    errorButton.removeEventListener('click', onErrorButtonClickHandler);
    errorBlock.removeEventListener('click', onErrorBlockClickHandler);
    window.removeEventListener('keydown', onErrorPopupEscKeydownHandler);
  }

  const onErrorPopupEscKeydownHandler = function (evt) {
    if (evt.code === 'Escape') {
      closeErrorPopup();
    }
  }

  const onErrorButtonClickHandler = function (evt) {
    evt.stopPropagation();

    closeErrorPopup();
  }

  const onErrorBlockClickHandler = function () {
    closeErrorPopup();
  }

  errorButton.addEventListener('click', onErrorButtonClickHandler)
  errorBlock.addEventListener('click', onErrorBlockClickHandler);
  window.addEventListener('keydown', onErrorPopupEscKeydownHandler);
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  sendAdvForm(fetchOnSuccess, fetchOnError, form);
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  resetForm();
});

avatarFileChooser.addEventListener('change', () => {
  const file = avatarFileChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  })

  if (matches) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
    });
  }
});

photoFileChooser.addEventListener('change', () => {
  const file = photoFileChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  })

  if (matches) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      photoPreview.style.backgroundImage = `url(${reader.result})`;
    });
  }
});
