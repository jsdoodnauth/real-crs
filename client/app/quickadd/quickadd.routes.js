'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('quickadd', {
      url: '/quickadd',
      template: '<quickadd></quickadd>',
      authenticate: true
    });
}
