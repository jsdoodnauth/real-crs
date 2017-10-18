'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './quickadd.routes';

export class QuickaddComponent {
  /*@ngInject*/
  constructor($http, $scope, Auth) {
    this.$http = $http;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  addMessage() {
    if(this.inputMessage && this.getCurrentUser().name) {
      console.log('ready: ' + this.inputMessage);
      this.$http.post('/api/messages', {
        message: this.inputMessage,
        contactID: '',
        contactName: this.inputName,
        followup: this.inputFollowup,
        agentID: '',
        agentName: this.getCurrentUser().name,
        isDone: false,
        userCreated: this.getCurrentUser().name,
        dateCreated: new Date(),
        userModified: this.getCurrentUser().name,
        dateModified: new Date()
      })
      .then(response => {
        this.alerts.push({msg: 'Another alert!'});
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
