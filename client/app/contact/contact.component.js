'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('person');
    });
  }

  $onInit() {
    this.$http.get('/api/persons')
      .then(response => {
        this.personCollection = response.data;
        this.socket.syncUpdates('person', this.personCollection);
      });
  }

  addPerson() {
    if(this.inputName) {
      this.$http.post('/api/persons', {
        name: this.inputName,
        companyName: this.inputCompany,
        dob: this.inputDOB,
        sex: this.inputSex,
        email: this.inputEmail,
        phone: this.inputPhone,
        occupation: this.inputOccupation,
        income: this.inputIncome,
        leadType: this.inputLeadType,
        leadStatus: this.inputLeadStatus,
        notes: this.inputNotes,
        rating: this.inputRating,
        userCreated: this.username,
        dateCreated: new Date(),
        userModified: this.username,
        dateModified: new Date()
      });
    }
  }
}

export default angular.module('realCrsApp.contact', [uiRouter])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: 'contactCtrl'
  })
  .name;
