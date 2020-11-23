'use strict';

// Модуль активации/деактивации страницы

(function () {

  window.map = document.querySelector('.map');
  window.mapFilters = window.map.querySelector('.map__filters-container');
  window.mapFiltersForm = window.mapFilters.querySelector('.map__filters');

  window.adsFragment = document.createDocumentFragment();

  window.adForm = document.querySelector('.ad-form');
  var adFormFieldsets = window.adForm.querySelectorAll('.ad-form fieldset');

  window.setup = {
    isPageActive: false,
    setPageInactive: function () {
      window.map.classList.add('map--faded');

      window.adForm.classList.add('ad-form--disabled');

      for (var fieldset of adFormFieldsets) {
        fieldset.disabled = true;
      }

      for (var filter of window.mapFiltersForm.children) {
        filter.disabled = true;
      }

      this.isPageActive = false;
    },
    setPageActive: function () {
      window.map.classList.remove('map--faded');

      window.adForm.classList.remove('ad-form--disabled');

      for (var fieldset of adFormFieldsets) {
        fieldset.disabled = false;
      }

      for (var filter of window.mapFiltersForm.children) {
        filter.disabled = false;
      }

      var pinsList = document.querySelector('.map__pins');
      pinsList.appendChild(adsFragment);

      window.addPinsClickEnterHandler();

      this.isPageActive = true;
    }
  };
})();
