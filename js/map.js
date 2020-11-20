'use strict';

// Модуль работы с картой

(function () {
  var ads = window.makeAdsArray();

  var adsFragment = document.createDocumentFragment();
  for (var ad of ads) {
    adsFragment.appendChild(window.pin.renderPin(ad));
  }

  var pinsList = document.querySelector('.map__pins');

  var map = document.querySelector('.map');

  var mapFilters = map.querySelector('.map__filters-container');
  var mapFiltersForm = mapFilters.querySelector('.map__filters');

  // Активация страницы и заполнение поля адреса

  var adFormFieldsets = window.adForm.querySelectorAll('.ad-form fieldset');

  var isPageActive = false;

  window.setPageInactive = function () {
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

  window.setPageActive = function () {
    map.classList.remove('map--faded');

    adForm.classList.remove('ad-form--disabled');

    for (var fieldset of adFormFieldsets) {
      fieldset.disabled = false;
    }

    for (var filter of mapFiltersForm.children) {
      filter.disabled = false;
    }

    pinsList.appendChild(adsFragment);

    addPinsClickEnterHandler();

    isPageActive = true;
  };

  var mapPinMain = map.querySelector('.map__pin--main');

  window.setAddressInputValue = function () {
    var addressInput = adForm.querySelector('#address');

    var addressX = mapPinMain.style.left.replace('px', '');
    var addressY = mapPinMain.style.top.replace('px', '');

    if (!isPageActive) {
      addressInput.value = (+addressX + window.pin.PIN_SIZE.width / 2) + ', ' + (+addressY + window.pin.PIN_SIZE.width / 2);
    } else {
      addressInput.value = (+addressX + window.pin.PIN_SIZE.width / 2) + ', ' + (+addressY + window.pin.PIN_SIZE.height);
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

  // Открыть и закрыть карточку объявления

  var openMapCardPopup = function (targetPin) {
    for (var ad of ads) {
      if (targetPin.src.includes(ad.author.avatar)) {
        var mapCard = window.renderCard(ad);
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

  var addPinsClickEnterHandler = function () {
    var mapPins = map.querySelectorAll('.map__pin');
    for (var pin of mapPins) {
      if (!pin.classList.contains('map__pin--main')) {
        var targetElement;
        pin.addEventListener('click', function (evt) {
          if (evt.target.classList.contains('map__pin')) {
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
  };
})();
