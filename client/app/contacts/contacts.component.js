'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contacts.routes';

export class ContactsComponent {
  /*@ngInject*/
  constructor($http, $scope, socket, Auth, $filter, Modal) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.Modal = Modal;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isAdmin = Auth.isAdminSync;
    this.editMode = false;    
    this.viewModeController(1);
    this.relationshipCollection = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('contact');
    });
  }

  $onInit() {
    this.$http.get('/api/contacts')
      .then(response => {
        this.coll = response.data;
        this.contactCollection = this.coll.filter((coll) => coll.active == true);        
        if (this.isAdmin) { this.contactCollection = response.data; }
        this.socket.syncUpdates('contact', this.contactCollection);
      });
    this.$http.get('/api/contacts/names')
      .then(response => {
        this.contactNameCollection = response.data;
      });  
  }
  editContactForm(contact) {
    this.$http.get('/api/contacts/' + contact._id)
      .then(response => {
        this.item = response.data;
        this.item.dob = this.$filter('date')(this.item.dob, 'yyyy-MM-dd');
        this.editMode = true;
        this.viewModeController(2);
        this.getRelationships(this.item._id);
      });
  }  

  editContact(contact) {
    if(this.item.firstName && this.item.lastName) {
      var isActive = true;
      if (this.isAdmin) { isActive = this.item.active; }
      this.$http.put('/api/contacts/'  + this.item._id, {
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
        notes: (this.item.notes) ? this.item.notes.replace(/\\n/g, "<br />") : this.item.notes,
        rating: this.item.rating,
        agentAssigned: this.item.agentAssigned,
        userModified: this.getCurrentUser().name,
        dateModified: new Date(),
        active: isActive
      })
      .then(response => {
        this.updateRelationship();
        //this.returnToList();
      });
    }
  }

  addContactForm() {
    this.clearContact();
    this.editMode = false;
    this.viewModeController(2);
  }
  addContact() {
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
        notes: (this.item.notes) ? this.item.notes.replace(/\\n/g, "<br />") : this.item.notes,
        rating: this.item.rating,
        agentAssigned: this.item.agentAssigned,
        userCreated: this.getCurrentUser().name,
        dateCreated: new Date(),
        userModified: this.getCurrentUser().name,
        dateModified: new Date(),
        active: true
      })
      .then(response => {
        this.updateRelationship();
        //this.returnToList();        
      });
    }
  }

  returnToList() {
    this.socket.syncUpdates('contact', this.contactCollection);
    this.viewModeController(1);
  }

  addRelationship() {
    console.log('addRelationship() -->');    
    var id = (this.item._id) ? this.item._id : "";
    this.relationshipCollection.push( {
      primaryID: id, 
      linkID: this.rel.relationshipName._id, 
      linkName: this.rel.relationshipName.name, 
      relationshipType: this.rel.relationshipType,
      connection:
        [{_id: id}, {_id: this.rel.relationshipName._id}]      
    });
    console.log(this.relationshipCollection);

    this.rel.relationshipName = "";
    this.rel.relationshipType = "";
  }

  removeRelationship(index) {
    this.relationshipCollection.splice(index, 1);    
  }

  getRelationships(id) {
    console.log(id);
    this.$http.get('/api/contactRelationships/' + id)
      .then(response => {
        console.log(response);
        this.relationshipCollection = response.data;
      });
  }

  updateRelationship() {
    this.$http.post('/api/contactRelationships', {
      data: this.relationshipCollection
    })
    .then(response => {
      this.returnToList();        
    });
  }

  deleteContactClick(contact) {
    var confContact = contact;
    var deleteConfirmationModal = this.Modal.confirm.delete(function() {
      if(confContact) {
        this.$http.put('/api/contacts/' + confContact._id, {
          active: false
        });
      }
    });

    return deleteConfirmationModal(contact.firstName + ' ' + contact.lastName);    
  }

  getRelationshipNamebyID(id, selfID) {
    if (selfID) {
      var relID = (selfID===id[0]) ? id[1] : id[0];
      var rel = this.$filter('filter')(this.contactNameCollection, {_id: relID}, true);
      if (rel.length) return rel[0].name;
    }
    return;
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
      this.item.agentAssigned = '';
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
