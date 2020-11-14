'use strict';

// Task 7.1

var makeAdsArray = function () {
  var ARRAY_SIZE = 8;
  var AD_TYPES = ['palace', 'flat', 'house', 'bungalow'];
  var AD_CHECKINS = ['12:00', '13:00', '14:00'];
  var AD_CHECKOUTS = ['12:00', '13:00', '14:00'];
  var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var adsArray = [];

  for (var i = 0; i < ARRAY_SIZE; i++) {
    adsArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения ' + (i + 1),
        address: '600, 350',
        price: getRandomNumber(1, 5) * 1000,
        type: getRandomItem(AD_TYPES),
        rooms: getRandomNumber(1, 10),
        guests: getRandomNumber(1, 10),
        checkin: getRandomItem(AD_CHECKINS),
        checkout: getRandomItem(AD_CHECKOUTS),
        features: makeRandomArrayFrom(AD_FEATURES),
        description: 'Описание предложения ' + (i + 1),
        photos: makeRandomArrayFrom(AD_PHOTOS)
      },
      location: {
        x: getRandomNumber(100, 1100),
        y: getRandomNumber(100, 630)
      }
    };
  }

  return adsArray;
};

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

var getRandomItem = function (arr) {
  var randomItem = Math.floor(Math.random() * arr.length);
  return arr[randomItem];
};

var makeRandomArrayFrom = function (arr) {
  var newArray = [];
  var newArraySize = getRandomNumber(1, arr.length);

  for (var i = 0; i < newArraySize; i++) {
    newArray[i] = arr[i];
  }

  return newArray;
};

// Task 7.3

var ads = makeAdsArray();

var PIN_SIZE = {
  width: 64,
  height: 82
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (pin.location.x - PIN_SIZE.width / 2) + 'px; top: ' + (pin.location.y + PIN_SIZE.height) + 'px;';

  var pinImage = pinElement.querySelector('img');
  pinImage.src = pin.author.avatar;
  pinImage.alt = pin.offer.title;

  return pinElement;
};

// Task 7.4

var pinsList = document.querySelector('.map__pins');

var fragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}

pinsList.appendChild(fragment);

// Task 8.2

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// var renderCard = function () {
//   var cardElement = cardTemplate.cloneNode(true);

//   var cardTitle = cardElement.querySelector('.popup__title');
//   var cardAddress = cardElement.querySelector('.popup__text--address');
//   var cardPrice = cardElement.querySelector('.popup__text--price');
//   var cardType = cardElement.querySelector('.popup__type');
//   var cardCapacity = cardElement.querySelector('.popup__text--capacity');
//   var cardTime = cardElement.querySelector('.popup__text--time');
//   var cardFeatures = cardElement.querySelector('.popup__features');
//   var cardDescription = cardElement.querySelector('.popup__description');
//   var cardPhotos = cardElement.querySelector('.popup__photos');
//   var cardAvatar = cardElement.querySelector('.popup__avatar');

//   cardTitle.textContent = ads[0].offer.title;
//   cardAddress.textContent = ads[0].offer.address;
//   cardPrice.textContent = ads[0].offer.price + '₽/ночь';

//   switch (ads[0].offer.type) {
//     case 'flat':
//       cardType.textContent = 'Квартира';
//       break;
//     case 'bungalow':
//       cardType.textContent = 'Бунгало';
//       break;
//     case 'house':
//       cardType.textContent = 'Дом';
//       break;
//     case 'palace':
//       cardType.textContent = 'Дворец';
//       break;
//   }

//   cardCapacity.textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
//   cardTime.textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkin;

//   cardFeatures.innerHTML = '';
//   for (var featureSingle of ads[0].offer.features) {
//     cardFeatures.innerHTML += '<li>' + featureSingle + '</li>';
//   }

//   cardDescription.textContent = ads[0].offer.description;

//   cardPhotos.innerHTML = '';
//   for (var photoSingle of ads[0].offer.photos) {
//     cardPhotos.innerHTML += '<img src="' + photoSingle + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
//   }

//   cardAvatar.src = ads[0].author.avatar;

//   return cardElement;
// };

var map = document.querySelector('.map');

//var mapCard = renderCard();
var mapFilters = map.querySelector('.map__filters-container');
var mapFiltersForm = mapFilters.querySelector('.map__filters');

//map.insertBefore(mapCard, mapFilters);

// Task 10

// Активация страницы и заполнение поля адреса

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('.ad-form fieldset');

var isPageActive = false;

var setPageInactive = function () {
  map.classList.add('map--faded');

  adForm.classList.add('ad-form--disabled');

  for (var fieldset of adFormFieldsets) {
    fieldset.disabled = true;
  }

  for (var filter of mapFiltersForm.children) {
    filter.disabled = true;
  }

  isPageActive = false;
}

var setPageActive = function () {
  map.classList.remove('map--faded');

  adForm.classList.remove('ad-form--disabled');

  for (var fieldset of adFormFieldsets) {
    fieldset.disabled = false;
  }

  for (var filter of mapFiltersForm.children) {
    filter.disabled = false;
  }

  isPageActive = true;
}

var mapPinMain = map.querySelector('.map__pin--main');

var setAddressInputValue = function () {
  var addressInput = adForm.querySelector('#address');

  var addressX = mapPinMain.style.left.replace('px', '');
  var addressY = mapPinMain.style.top.replace('px', '');

  if (!isPageActive) {
    addressInput.value =  (+addressX + PIN_SIZE.width / 2) + ', ' + (+addressY + PIN_SIZE.width / 2);
  } else {
    addressInput.value =  (+addressX + PIN_SIZE.width / 2) + ', ' + (+addressY + PIN_SIZE.height);
  }
}

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    setPageActive();
    setAddressInputValue();
  }
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    setPageActive();
    setAddressInputValue();
  }
});

setPageInactive();
setAddressInputValue();

// Валидация полей количества гостей с количеством комнат

var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

var setCapacityOptions = function (roomNumber) {
  var capacitySelectOptions = adForm.querySelectorAll('#capacity option');

  var resetCapacityOptions = function () {
    for (var capacitySelectOption of capacitySelectOptions) {
      capacitySelectOption.disabled = false;
    }
  }

  if (roomNumber) {
    if (roomNumber === '1') {
      resetCapacityOptions();
      capacitySelectOptions[2].selected = true;
      capacitySelectOptions[0].disabled = true;
      capacitySelectOptions[1].disabled = true;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '2') {
      resetCapacityOptions();
      capacitySelectOptions[1].selected = true;
      capacitySelectOptions[2].disabled = false;
      capacitySelectOptions[0].disabled = true;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '3') {
      resetCapacityOptions();
      capacitySelectOptions[0].selected = true;
      capacitySelectOptions[1].disabled = false;
      capacitySelectOptions[2].disabled = false;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '100') {
      resetCapacityOptions();
      capacitySelectOptions[3].selected = true;
      capacitySelectOptions[1].disabled = true;
      capacitySelectOptions[2].disabled = true;
      capacitySelectOptions[0].disabled = true;
    }
  } else {
    setCapacityOptions(roomNumberSelect.value);
  }
}

setCapacityOptions();

roomNumberSelect.addEventListener('change', function (evt) {
  setCapacityOptions(evt.target.value);
});
