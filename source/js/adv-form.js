import {map} from './map.js';
import {sendAdvForm, onFetchError} from './fetch.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const roomNumberValues = {
  one: 1,
  two: 2,
  three: 3,
  hundred: 100,
};

const capacityValues = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
};

const typeSelectValues = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
}

const main = document.querySelector('main');
const successTemplate = document.querySelector('#success').content;
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

typeSelect.addEventListener('change', () => {
  let min;

  if (typeSelect.value === 'bungalow') {
    min = typeSelectValues.bungalow;
  } else if (typeSelect.value === 'flat') {
    min = typeSelectValues.flat;
  } else if (typeSelect.value === 'house') {
    min = typeSelectValues.house;
  } else if (typeSelect.value === 'palace') {
    min = typeSelectValues.palace;
  }

  priceInput.placeholder = min;
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

  avatarPreview.setAttribute('data-default-src', avatarPreview.src);
});

const checkCapacity = function () {
  let customValidityMessage = '';

  const roomNumberSelectValue = +roomNumberSelect.value;
  const capacitySelectValue = +capacitySelect.value;

  if (roomNumberSelectValue === roomNumberValues.one) {
    if (capacitySelectValue === capacityValues.one) {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 1 комнаты допустимое кол-во мест "для 1 гостя"';
    }
  } else if (roomNumberSelectValue === roomNumberValues.two) {
    if (capacitySelectValue === capacityValues.one || capacitySelectValue === capacityValues.two) {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 2 комнат допустимое кол-во мест "для 1 гостя" или "для 2 гостей"';
    }
  } else if (roomNumberSelectValue === roomNumberValues.three) {
    if (capacitySelectValue === capacityValues.one || capacitySelectValue === capacityValues.two || capacitySelectValue === capacityValues.three) {
      customValidityMessage = '';
    } else {
      customValidityMessage = 'Для 3 комнат допустимое кол-во мест "для 1 гостя" или "для 2 гостей" или "для 3 гостей"';
    }
  } else if (roomNumberSelectValue === roomNumberValues.hundred) {
    if (capacitySelectValue === capacityValues.zero) {
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

const resetForm = function () {
  form.reset();
  checkCapacity();
  map.fire('adv-form-submitted');

  avatarPreview.src = avatarPreview.getAttribute('data-default-src');
  photoPreview.style.backgroundImage = null;
}

const onFetchSuccess = function () {
  const successTemplateClone = successTemplate.cloneNode(true);
  const successBlock = successTemplateClone.querySelector('.success');

  main.appendChild(successTemplateClone);

  const closeSuccessPopup = function () {
    successBlock.classList.add('visually-hidden');

    successBlock.removeEventListener('click', onSuccessBlockClick);
    window.removeEventListener('keydown', onSuccessPopupEscKeydown);
  }

  const onSuccessBlockClick = function () {
    closeSuccessPopup();
  }

  const onSuccessPopupEscKeydown = function (evt) {
    if (evt.code === 'Escape') {
      closeSuccessPopup();
    }
  }

  successBlock.addEventListener('click', onSuccessBlockClick);
  window.addEventListener('keydown', onSuccessPopupEscKeydown);

  resetForm();
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  sendAdvForm(onFetchSuccess, onFetchError, form);
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  resetForm();
});

const onFilePreview = function (fileSelector, previewSelector) {
  const file = fileSelector.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  })

  if (matches) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      if('src' in previewSelector) {
        previewSelector.src = reader.result;
      } else {
        previewSelector.style.backgroundImage = `url(${reader.result})`;
      }
    });
  }
}

avatarFileChooser.addEventListener('change', () => {
  onFilePreview(avatarFileChooser, avatarPreview);
});

photoFileChooser.addEventListener('change', () => {
  onFilePreview(photoFileChooser, photoPreview);
});
