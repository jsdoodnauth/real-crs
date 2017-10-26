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
    this.deleteRelationship = [];
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('contact');
    });
  }

  $onInit() {
    this.$http.get('/api/contacts')
      .then(response => {
        this.coll = response.data;
        this.contactCollection = this.coll.filter((coll) => coll.active == true);        
        if (this.isAdmin()) { this.contactCollection = response.data; }
        this.socket.syncUpdates('contact', this.contactCollection);
      });
    this.initFields();
  }

  initFields() {    
    this.$http.get('/api/contacts/names')
      .then(response => {
        this.contactNameCollection = response.data;
      });  
    this.$http.get('/api/contacts/address')
      .then(response => {
        this.addressCollection = response.data;
      }); 
  }

  updateContactCollection(contact) {
    for (var i = this.contactCollection.length - 1; i >= 0; i--) {
      if (this.contactCollection[i]._id === contact._id) {
        this.contactCollection[i].firstName = contact.firstName;
        this.contactCollection[i].lastName = contact.lastName;
        this.contactCollection[i].companyName = contact.companyName;
        this.contactCollection[i].dob = contact.dob;
        this.contactCollection[i].sex = contact.sex;
        this.contactCollection[i].address = contact.address;
        this.contactCollection[i].city = contact.city;
        this.contactCollection[i].province = contact.province;
        this.contactCollection[i].postalcode = contact.postalcode;
        this.contactCollection[i].email = contact.email;
        this.contactCollection[i].phone = contact.phone;
        this.contactCollection[i].occupation = contact.occupation;
        this.contactCollection[i].income = contact.income;
        this.contactCollection[i].leadType = contact.leadType;
        this.contactCollection[i].leadStatus = contact.leadStatus;
        this.contactCollection[i].notes = contact.notes;
        this.contactCollection[i].rating = contact.rating;
        this.contactCollection[i].agentAssigned = contact.agentAssigned;
        return;
      }
    };
  }

  editContactForm(contact) {
    this.$http.get('/api/contacts/' + contact._id)
      .then(response => {
        this.item = response.data;
        this.item.dob = this.$filter('date')(this.item.dob, 'yyyy-MM-dd');
        this.editMode = true;
        this.viewModeController(2);
        this.initFields();
        this.getRelationships(this.item._id);
      });
  }  

  editContact(contact) {
    var editContactItem = contact;
    if(this.item.firstName && this.item.lastName) {
      var isActive = true;
      if (this.isAdmin()) { isActive = this.item.active; }
      this.$http.put('/api/contacts/'  + this.item._id, {
        firstName: this.item.firstName,
        lastName: this.item.lastName,
        companyName: this.item.companyName,
        dob: this.item.dob,
        sex: this.item.sex,
        address: this.item.address,
        city: this.item.city,
        province: this.item.province,
        postalcode: this.item.postalcode,
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
        this.updateContactCollection(editContactItem);
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
        address: this.item.address,
        city: this.item.city,
        province: this.item.province,
        postalcode: this.item.postalcode,
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
    this.relationshipCollection = [];
    this.deleteRelationship = [];
    this.viewModeController(1);
  }

  addRelationship() {
    var id = (this.item._id) ? this.item._id : "";
    this.relationshipCollection.push( {
      connection:
        [{_id: id}, {_id: this.rel.relationshipName._id}],
      relationshipType: this.rel.relationshipType
    });
    
    this.rel.relationshipName = "";
    this.rel.relationshipType = "";
  }

  removeRelationship(index, id) {
    if (id.length) {
      this.deleteRelationship.push(id);
    }
    this.relationshipCollection.splice(index, 1);
  }

  getRelationships(id) {
    this.$http.get('/api/contactRelationships/' + id)
      .then(response => {
        this.relationshipCollection = response.data;
      });
  }

  updateRelationship() {
    var addRelationshipList = this.relationshipCollection.filter(this.filterOutByID);
    if (addRelationshipList.length) {
      this.$http.post('/api/contactRelationships', {
        data: addRelationshipList
      })
      .then(response => {
        this.removeRelationships();
      });
    }
    else {
      this.removeRelationships();
    }
  }

  removeRelationships() {
    if (this.deleteRelationship.length) {
      this.$http.delete('/api/contactRelationships/' + this.deleteRelationship, {
        data: this.deleteRelationship
      })
      .then(response => {
        this.returnToList();        
      });
    }
    else {
      return this.returnToList();  
    }
     
  }

  filterOutByID(item) {
    return (item._id) ? false : true 
  }

  getRelationshipNamebyID(id, selfID) {
    var id1 = id[0]._id;
    var id2 = id[1]._id;
    if (id[0].length) {
      var id1 = id[0];
      var id2 = id[1];
    }

    if (selfID) {
      var relID = (selfID===id1) ? id2 : id1;
      var rel = this.$filter('filter')(this.contactNameCollection, {_id: relID}, true);
      if (rel.length) {
        return rel[0].name;
      }
    }

    return;
  }

  deleteContactClick(contact) {
    var confContact = contact;
    var self = this;
    var deleteConfirmationModal = this.Modal.confirm.delete(function() {
      if(confContact) {
        self.$http.put('/api/contacts/' + confContact._id, {
          active: false
        })
        .then(response => {          
          var index = self.contactCollection.indexOf(confContact);
          self.contactCollection.splice(index,1);
        });
      }
    });

    return deleteConfirmationModal(contact.firstName + ' ' + contact.lastName);    
  }

  clearContact() {
    if (this.item) {
      this.item.firstName = '';
      this.item.lastName = '';
      this.item.companyName = '';
      this.item.dob = '';
      this.item.sex = '';
      this.item.address = '';
      this.item.city = '';
      this.item.province = '';
      this.item.postalcode = '';
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
