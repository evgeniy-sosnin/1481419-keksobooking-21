'use strict';

// Модуль работы с картой

(function () {

  // Генерируем данные и рисуем пины

  var mockAds = window.makeAdsArray();

  for (var i = 0; i < mockAds.length; i++) {
    window.adsFragment.appendChild(window.pin.renderPin(mockAds[i]));
  }

  // Открыть и закрыть карточку объявления

  var openMapCardPopup = function (targetPin) {
    for (var ad of mockAds) {
      if (targetPin.src.includes(ad.author.avatar)) {
        var mapCard = window.renderCard(ad);
        var mapCardClose = mapCard.querySelector('.popup__close');
        window.map.insertBefore(mapCard, window.mapFilters);

        mapCardClose.addEventListener('click', function () {
          closeMapCardPopup();
        });

        document.addEventListener('keydown', onMapCardPopupEscapePress);
      }
    }
  };

  var closeMapCardPopup = function () {
    var mapCard = window.map.querySelector('.map__card');
    if (mapCard) {
      window.map.removeChild(mapCard);

      document.removeEventListener('keydown', onMapCardPopupEscapePress);
    }
  };

  window.addPinsClickEnterHandler = function () {
    var mapPins = window.map.querySelectorAll('.map__pin');
    for (var pin of mapPins) {
      if (!pin.classList.contains('map__pin--main')) {
        var targetElement;
        pin.addEventListener('click', function (evt) {
          if (evt.target.classList.contains('map__pin')) {
            targetElement = evt.target.querySelector('img');
          } else {
            targetElement = evt.target;
          }

          var mapCard = window.map.querySelector('.map__card');
          if (mapCard) {
            window.map.removeChild(mapCard);
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
