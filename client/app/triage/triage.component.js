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
    this.$http.get('/api/messages')
      .then(response => {
        this.messageCollection = response.data;
        //this.socket.syncUpdates('messages', this.messageCollection);
      });
  }

  openContact(contact) {

  }

  closeItem(triageItem) {
    
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
