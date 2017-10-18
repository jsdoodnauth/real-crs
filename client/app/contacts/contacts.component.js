'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contacts.routes';

export class ContactsComponent {
  /*@ngInject*/
  constructor($http, $scope, socket, Auth, $filter, Modal, $uibModal) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.Modal = Modal;
    this.$uibModal = $uibModal;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.editMode = false;    
    this.viewModeController(1);

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('contact');
    });
  }

  $onInit() {
    this.$http.get('/api/contacts')
      .then(response => {
        this.contactCollection = response.data;
        this.socket.syncUpdates('contact', this.contactCollection);
      });
  }
  editContactForm(contact) {
    this.$http.get('/api/contacts/' + contact._id)
      .then(response => {
        this.item = response.data;
        this.item.dob = this.$filter('date')(this.item.dob, 'yyyy-MM-dd');
        this.editMode = true;
        this.viewModeController(2);
      });
  }  

  editContact(contact) {
    console.log('editContact()');
    if(this.item.firstName && this.item.lastName) {
      this.$http.post('/api/contacts/'  + contact._id, {
        firstName: this.item.firstName,
        lastName: this.item.lastName,
        companyName: this.item.companyName,
        dob: this.item.dob,
        sex: this.item.sex,
        email: this.item.email,
        phone: this.item.phone,
        occupation: this.item.occupation,
        income: this.item.income,
        leadType: this.item.leadType,
        leadStatus: this.item.leadStatus,
        notes: this.item.notes,
        rating: this.item.rating,
        agentName: this.item.agentname,
        userCreated: this.username,
        dateCreated: new Date(),
        userModified: this.username,
        dateModified: new Date()
      });
    }
  }

  addContactForm() {
    this.clearContact();
    this.editMode = false;
    this.viewModeController(2);
  }
  addContact() {
    console.log('addContact()');
    if(this.item.firstName && this.item.lastName) {
      this.$http.post('/api/contacts', {
        firstName: this.item.firstName,
        lastName: this.item.lastName,
        companyName: this.item.companyName,
        dob: this.item.dob,
        sex: this.item.sex,
        email: this.item.email,
        phone: this.item.phone,
        occupation: this.item.occupation,
        income: this.item.income,
        leadType: this.item.leadType,
        leadStatus: this.item.leadStatus,
        notes: this.item.notes,
        rating: this.item.rating,
        agentName: this.item.agentname,
        userCreated: this.username,
        dateCreated: new Date(),
        userModified: this.username,
        dateModified: new Date(),
        active: true
      });
    }
  }

  deleteContactClick(contact) {
    var deleteConfirmationModal = this.Modal.confirm.delete(function(contact) {
      this.deleteContact(contact);
    });

    return deleteConfirmationModal(contact.firstName + ' ' + contact.lastName);    
  }

  deleteContact(contact) {
    if(contact) {
      this.$http.post('/api/contacts/' + contact._id, {
        firstName: contact.firstName,
        lastName: contact.lastName,
        companyName: contact.companyName,
        dob: contact.dob,
        sex: contact.sex,
        email: contact.email,
        phone: contact.phone,
        occupation: contact.occupation,
        income: contact.income,
        leadType: contact.leadType,
        leadStatus: contact.leadStatus,
        notes: contact.notes,
        rating: contact.rating,
        agentName: contact.agentname,
        userCreated: this.username,
        dateCreated: new Date(),
        userModified: this.username,
        dateModified: new Date(),
        active: false
      });
      }
    }

  clearContact() {
    if (this.item) {
      this.item.firstName = '';
      this.item.lastName = '';
      this.item.companyName = '';
      this.item.dob = '';
      this.item.sex = '';
      this.item.email = '';
      this.item.phone = '';
      this.item.occupation = '';
      this.item.income = '';
      this.item.leadType = '';
      this.item.leadStatus = '';
      this.item.notes = '';
      this.item.rating = '';
    }
  }

  cancelForm() {
    this.viewModeController(1);    
  }

  viewModeController(viewMode) {
    switch(viewMode) {
      case 1:
        this.viewMode = 1;
        break;
      case 2:
        this.viewMode = 2;
        break;
    }
  }
}

export default angular.module('realCrsApp.contacts', [uiRouter])
  .config(routes)
  .component('contacts', {
    template: require('./contacts.html'),
    controller: ContactsComponent,
    controllerAs: 'contactsCtrl'
  })
  .name;
