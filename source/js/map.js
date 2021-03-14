/* global L:readonly */
import {getRentPopup} from './popup.js';
import {fetchMapData} from './fetch.js';

const addressInput = document.querySelector('#address');
const mapCenterLatLng = {
  lat: 35.6895000,
  lng: 139.6917100,
};

const map = L.map('map-canvas')
  .setView(mapCenterLatLng, 10);

const markers = L.layerGroup().addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const pinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const mainPinMarker = L.marker(
  map.getCenter(),
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);

mainPinMarker.on('moveend', (evt) => {
  addressInput.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
});

map.on('adv-form-submitted', () => {
  map.setView(mapCenterLatLng, 10);
  mainPinMarker.setLatLng(mapCenterLatLng).fire('moveend');
});

const renderMarkers = function (rents) {
  markers.clearLayers();

  rents.forEach((rent) => {
    markers.addLayer(rent.pointerMarker);
  })
}

const fetchOnSuccess = function (rents) {
  rents.forEach((rent) => {
    const popupHtml = getRentPopup(rent, true);

    const pinMarker = L.marker(
      {
        lat: rent.location.lat,
        lng: rent.location.lng,
      },
      {
        icon: pinIcon,
      });

    const helperDiv = document.createElement('div');
    helperDiv.appendChild(popupHtml);

    pinMarker.bindPopup(helperDiv.innerHTML);

    rent.pointerMarker = pinMarker;
  })

  map.fire('load-all-data', {rents: rents});
};

const fetchOnError = function (err) {
  const main = document.querySelector('main');
  const errorTemplate = document.querySelector('#error-data').content.cloneNode(true);
  const errorBlock = errorTemplate.querySelector('.error');
  const errorButton = errorTemplate.querySelector('.error__button');

  errorTemplate.querySelector('.error__details').textContent = err;

  main.appendChild(errorTemplate);

  const closeErrorPopup = function () {
    errorBlock.classList.add('visually-hidden');

    errorButton.removeEventListener('click', onErrorButtonClickHandler);
    errorBlock.removeEventListener('click', onErrorBlockClickHandler);
    window.removeEventListener('keydown', onErrorPopupEscKeydownHandler);
  }

  const onErrorButtonClickHandler = function (evt) {
    evt.stopPropagation();

    closeErrorPopup();
  }

  const onErrorBlockClickHandler = function () {
    closeErrorPopup();
  }

  const onErrorPopupEscKeydownHandler = function (evt) {
    if (evt.code === 'Escape') {
      closeErrorPopup();
    }
  }

  errorButton.addEventListener('click', onErrorButtonClickHandler);
  errorBlock.addEventListener('click', onErrorBlockClickHandler);
  window.addEventListener('keydown', onErrorPopupEscKeydownHandler);
}

map.addHandler('load', function () {
  addressInput.setAttribute('readonly', '');
  addressInput.value = `${mainPinMarker.getLatLng().lat.toFixed(5)}, ${mainPinMarker.getLatLng().lng.toFixed(5)}`;

  fetchMapData(fetchOnSuccess, fetchOnError);
});

export {map, renderMarkers};
