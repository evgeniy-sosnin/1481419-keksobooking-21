'use strict';

// Модуль создания массива из 8 сгенерированных JS объектов

(function () {
  window.makeAdsArray = function () {
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
})();
