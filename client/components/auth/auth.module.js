'use strict';

angular.module('aliimsApp.auth', ['aliimsApp.constants', 'aliimsApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
