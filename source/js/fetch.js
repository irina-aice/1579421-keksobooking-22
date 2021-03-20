const main = document.querySelector('main');
const errorTemplate = document.querySelector('#error-data').content;

const fetchMapData = (onSuccess, onError) => {
  return fetch(
    'https://22.javascript.pages.academy/keksobooking/data',
    {
      method: 'GET',
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((json) => {
      onSuccess(json);
    })
    .catch((err) => {
      onError(err);
    });
};

const sendAdvForm = (onSuccess, onError, formData) => {
  return fetch(
    'https://22.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(formData),
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((json) => {
      onSuccess(json);
    })
    .catch((err) => {
      onError(err);
    });
};

const onFetchError = function (err) {
  const errorTemplateClone = errorTemplate.cloneNode(true);
  const errorBlock = errorTemplateClone.querySelector('.error');
  const errorButton = errorTemplateClone.querySelector('.error__button');
  const errorDetails =  errorTemplateClone.querySelector('.error__details');

  if (errorDetails && err) {
    errorTemplateClone.querySelector('.error__details').textContent = err;
  }

  main.appendChild(errorTemplateClone);

  const closeErrorPopup = function () {
    errorBlock.classList.add('visually-hidden');

    errorButton.removeEventListener('click', onErrorButtonClick);
    errorBlock.removeEventListener('click', onErrorBlockClick);
    window.removeEventListener('keydown', onErrorPopupEscKeydown);
  }

  const onErrorButtonClick = function (evt) {
    evt.stopPropagation();

    closeErrorPopup();
  }

  const onErrorBlockClick = function () {
    closeErrorPopup();
  }

  const onErrorPopupEscKeydown = function (evt) {
    if (evt.code === 'Escape') {
      closeErrorPopup();
    }
  }

  errorButton.addEventListener('click', onErrorButtonClick);
  errorBlock.addEventListener('click', onErrorBlockClick);
  window.addEventListener('keydown', onErrorPopupEscKeydown);
}


export {fetchMapData, sendAdvForm, onFetchError};
