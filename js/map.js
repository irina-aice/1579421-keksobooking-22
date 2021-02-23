/* global L:readonly */
import {rents} from './data.js';
import {getRentPopup} from './popup.js';

const addressInput = document.querySelector('#address');

const map = L.map('map-canvas')
  .setView({
    lat: 35.6895000,
    lng: 139.6917100,
  }, 10);

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

map.addHandler('load', function () {
  addressInput.setAttribute('readonly', '');
  addressInput.value = `${mainPinMarker.getLatLng().lat.toFixed(5)}, ${mainPinMarker.getLatLng().lng.toFixed(5)}`;
});

mainPinMarker.on('moveend', (evt) => {
  addressInput.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
});

rents.forEach((rent) => {
  const popupHtml = getRentPopup(rent, true);

  const pinMarker = L.marker(
    {
      lat: rent.location.x,
      lng: rent.location.y,
    },
    {
      icon: pinIcon,
    });

  //вставка DocumentFragment в качестве контента для popup вызывает странное поведение,
  //поэтому DocumentFragment преобразуем в html строку
  const helperDiv = document.createElement('div');
  helperDiv.appendChild(popupHtml);

  pinMarker.bindPopup(helperDiv.innerHTML).addTo(map);
})

export {map};
