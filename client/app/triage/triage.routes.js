'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('triage', {
      url: '/triage',
      template: '<triage></triage>',
      authenticate: true
    });
}
