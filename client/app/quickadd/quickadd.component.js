'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './quickadd.routes';

export class QuickaddComponent {
  /*@ngInject*/
  constructor($http, $scope, Auth) {
    this.$http = $http;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.contactCollection;
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

  getContacts(val) {
    if (!this.contactCollection) {
      console.log('call');
      this.$http.get('/api/contacts/filter')
        .then(response => {
          this.contactCollection = response.data;
        });
    }


    /*
    return this.$http.get('/api/contacts', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
    */
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
