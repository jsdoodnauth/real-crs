'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './triage.routes';

export class TriageComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }
  $onInit() {
    this.$http.get('/api/triages')
      .then(response => {
        this.triageCollection = response.data;
        //this.socket.syncUpdates('triage', this.triageCollection);
      });
  }
}

export default angular.module('realCrsApp.triage', [uiRouter])
  .config(routes)
  .component('triage', {
    template: require('./triage.html'),
    controller: TriageComponent,
    controllerAs: 'triageCtrl'
  })
  .name;
