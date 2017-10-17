'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('contacts', {
      url: '/contacts',
      template: '<contacts></contacts>'
    });
}
