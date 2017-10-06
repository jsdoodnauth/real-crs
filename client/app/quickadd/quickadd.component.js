'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './quickadd.routes';

export class QuickaddComponent {
  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  addNote() {
    if(this.inputName) {
      this.$http.post('/api/triages', {
        name: this.inputName,
        notes: this.inputNotes,
        leadType: this.inputLeadType,
        active: true,
        userCreated: this.username,
        dateCreated: new Date(),
        userModified: this.username,
        dateModified: new Date()
      });
    }
  }
}

export default angular.module('realCrsApp.quickadd', [uiRouter])
  .config(routes)
  .component('quickadd', {
    template: require('./quickadd.html'),
    controller: QuickaddComponent,
    controllerAs: 'quickaddCtrl'
  })
  .name;
