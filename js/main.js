'use strict';

// Создание массива из 8 сгенерированных JS объектов

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

// Отрисовка пинов по шаблону и заполнение сгенерированными данными

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

var pinsList = document.querySelector('.map__pins');

var fragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}

// Отрисовка карточки по шаблону

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderCard = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);

  var cardTitle = cardElement.querySelector('.popup__title');
  var cardAddress = cardElement.querySelector('.popup__text--address');
  var cardPrice = cardElement.querySelector('.popup__text--price');
  var cardType = cardElement.querySelector('.popup__type');
  var cardCapacity = cardElement.querySelector('.popup__text--capacity');
  var cardTime = cardElement.querySelector('.popup__text--time');
  var cardFeatures = cardElement.querySelector('.popup__features');
  var cardDescription = cardElement.querySelector('.popup__description');
  var cardPhotos = cardElement.querySelector('.popup__photos');
  var cardAvatar = cardElement.querySelector('.popup__avatar');

  cardTitle.textContent = ad.offer.title;
  cardAddress.textContent = ad.offer.address;
  cardPrice.textContent = ad.offer.price + '₽/ночь';

  switch (ad.offer.type) {
    case 'flat':
      cardType.textContent = 'Квартира';
      break;
    case 'bungalow':
      cardType.textContent = 'Бунгало';
      break;
    case 'house':
      cardType.textContent = 'Дом';
      break;
    case 'palace':
      cardType.textContent = 'Дворец';
      break;
  }

  cardCapacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkin;

  cardFeatures.innerHTML = '';
  for (var featureSingle of ad.offer.features) {
    cardFeatures.innerHTML += '<li>' + featureSingle + '</li>';
  }

  cardDescription.textContent = ad.offer.description;

  cardPhotos.innerHTML = '';
  for (var photoSingle of ad.offer.photos) {
    cardPhotos.innerHTML += '<img src="' + photoSingle + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  }

  cardAvatar.src = ad.author.avatar;

  return cardElement;
};

var map = document.querySelector('.map');

var mapFilters = map.querySelector('.map__filters-container');
var mapFiltersForm = mapFilters.querySelector('.map__filters');

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
};

var setPageActive = function () {
  map.classList.remove('map--faded');

  adForm.classList.remove('ad-form--disabled');

  for (var fieldset of adFormFieldsets) {
    fieldset.disabled = false;
  }

  for (var filter of mapFiltersForm.children) {
    filter.disabled = false;
  }

  pinsList.appendChild(fragment);

  addPinsClickAndEnterHandler();

  isPageActive = true;
};

var mapPinMain = map.querySelector('.map__pin--main');

var setAddressInputValue = function () {
  var addressInput = adForm.querySelector('#address');

  var addressX = mapPinMain.style.left.replace('px', '');
  var addressY = mapPinMain.style.top.replace('px', '');

  if (!isPageActive) {
    addressInput.value = (+addressX + PIN_SIZE.width / 2) + ', ' + (+addressY + PIN_SIZE.width / 2);
  } else {
    addressInput.value = (+addressX + PIN_SIZE.width / 2) + ', ' + (+addressY + PIN_SIZE.height);
  }
};

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

// Валидация полей «Количество комнат» и «Количество мест»

var roomNumberSelect = adForm.querySelector('#room_number');

var setCapacityOptions = function (roomNumber) {
  var capacitySelectOptions = adForm.querySelectorAll('#capacity option');

  var resetCapacityOptions = function () {
    for (var capacitySelectOption of capacitySelectOptions) {
      capacitySelectOption.disabled = false;
    }
  };

  if (roomNumber) {
    if (roomNumber === '1') {
      resetCapacityOptions();
      // capacitySelectOptions[2].selected = true;
      capacitySelectOptions[0].disabled = true;
      capacitySelectOptions[1].disabled = true;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '2') {
      resetCapacityOptions();
      // capacitySelectOptions[1].selected = true;
      capacitySelectOptions[2].disabled = false;
      capacitySelectOptions[0].disabled = true;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '3') {
      resetCapacityOptions();
      // capacitySelectOptions[0].selected = true;
      capacitySelectOptions[1].disabled = false;
      capacitySelectOptions[2].disabled = false;
      capacitySelectOptions[3].disabled = true;
    } else if (roomNumber === '100') {
      resetCapacityOptions();
      // capacitySelectOptions[3].selected = true;
      capacitySelectOptions[1].disabled = true;
      capacitySelectOptions[2].disabled = true;
      capacitySelectOptions[0].disabled = true;
    }
  } else {
    setCapacityOptions(roomNumberSelect.value);
  }
};

setCapacityOptions();

roomNumberSelect.addEventListener('change', function (evt) {
  setCapacityOptions(evt.target.value);
});

// Валидация полей «Тип жилья» и «Цена за ночь»

var placeType = adForm.querySelector('#type');
var pricePerNight = adForm.querySelector('#price');

var minPrice;
var maxPrice = 1000000;

var setMinPrice = function (placeTypeValue) {
  switch (placeTypeValue) {
    case 'bungalow':
      minPrice = 0;
      break;
    case 'flat':
      minPrice = 1000;
      break;
    case 'house':
      minPrice = 5000;
      break;
    case 'palace':
      minPrice = 10000;
      break;
  }
}

placeType.addEventListener('change', function (evt) {
  pricePerNight.value = '';
  setMinPrice(evt.target.value);
});

pricePerNight.addEventListener('input', function () {
  if (pricePerNight.value < minPrice) {
    pricePerNight.setCustomValidity('Для этого типа жилья минимальная цена за ночь ' + minPrice + ' руб.');
  } else if (pricePerNight.value > maxPrice) {
    pricePerNight.setCustomValidity('Максимальная цена за ночь ' + maxPrice + ' руб.');
  } else {
    userNameInput.setCustomValidity('');
  }

  pricePerNight.reportValidity();
});

// Валидация полей «Время заезда и выезда»

var timeIn = adForm.querySelector('#timein');
var timeInOptions = adForm.querySelectorAll('#timein option');

var timeOut = adForm.querySelector('#timeout');
var timeOutOptions = adForm.querySelectorAll('#timeout option');

var setTimeIn = function (timeOutValue) {
  for (var option of timeInOptions) {
    if (option.value === timeOutValue) {
      option.selected = true;
    }
  }
}

var setTimeOut = function (timeInValue) {
  for (var option of timeOutOptions) {
    if (option.value === timeInValue) {
      option.selected = true;
    }
  }
}

timeIn.addEventListener('change', function (evt) {
  setTimeOut(evt.target.value);
});

timeOut.addEventListener('change', function (evt) {
  setTimeIn(evt.target.value);
});

// Открыть и закрыть карточку объявления

var openMapCardPopup = function (targetPin) {
  for (var i = 0; i < ads.length; i++) {
    if (targetPin.src.includes(ads[i].author.avatar)) {
      var mapCard = renderCard(ads[i]);
      var mapCardClose = mapCard.querySelector('.popup__close');
      map.insertBefore(mapCard, mapFilters);

      mapCardClose.addEventListener('click', function () {
        closeMapCardPopup();
      });

      document.addEventListener('keydown', onMapCardPopupEscapePress);
    }
  }
};

var closeMapCardPopup = function () {
  var mapCard = map.querySelector('.map__card');
  if (mapCard) {
    map.removeChild(mapCard);

    document.removeEventListener('keydown', onMapCardPopupEscapePress);
    }
};

var addPinsClickAndEnterHandler = function () {
  var mapPins = map.querySelectorAll('.map__pin');
  for (var i = 0; i < mapPins.length; i++) {
    if (!mapPins[i].classList.contains('map__pin--main')) {
      var targetElement;
      mapPins[i].addEventListener('click', function (evt) {
        if (evt.target.tagName === 'BUTTON') {
          targetElement = evt.target.querySelector('img');
        } else {
          targetElement = evt.target;
        }

        var mapCard = map.querySelector('.map__card');
        if (mapCard) {
          map.removeChild(mapCard);
          openMapCardPopup(targetElement);
        } else {
          openMapCardPopup(targetElement);
        }
      });
    }
  }
};

var onMapCardPopupEscapePress = function (evt) {
  if (evt.key === 'Escape') {
    closeMapCardPopup();
  }
}
