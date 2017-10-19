'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './quickadd.routes';

export class QuickaddComponent {
  /*@ngInject*/
  constructor($http, $scope, Auth, $timeout) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.alerts = [];
  }

  $onInit() {
    this.$http.get('/api/contacts/names')
      .then(response => {
        this.contactCollection = response.data;
      });
  }

  addMessage() {
    var item = this;
    if(this.inputMessage && this.getCurrentUser().name) {
      this.$http.post('/api/messages', {
        message: this.inputMessage,
        contactID: this.inputName._id,
        contactName: this.inputName.name ? this.inputName.name : this.inputName,
        followup: this.inputFollowup,
        agentID: this.getCurrentUser()._id,
        agentName: this.getCurrentUser().name,
        isDone: false,
        isNewContact: this.inputName.name ? false : true,
        userCreated: this.getCurrentUser().name,
        dateCreated: new Date(),
        userModified: this.getCurrentUser().name,
        dateModified: new Date()
      })
      .then(response => {
        this.toggleSuccess();
        this.clearForm();
      })
      .catch(function (data) {
        item.alerts.push({ type: 'danger', msg: 'Error sending message - ' + data.statusText});
      });
    }
  }

  clearForm() {
    this.inputMessage = '';
    this.inputName = '';
    this.inputFollowup = '';
  }

  toggleSuccess() {
    var s = this;
    this.isSuccess = 'success';
    this.$timeout(function(){
        s.isSuccess = '';
        //s.alerts.push({ type: 'success', msg: 'Message sent successfully'});
    }, 2500);
  }

  closeAlert() {
    this.alerts = [];
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
