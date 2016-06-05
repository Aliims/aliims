'use strict';

angular.module('aliimsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sta001', {
        url: '/sta001',
        template: '<sta-001></sta-001>'
      });
  });
