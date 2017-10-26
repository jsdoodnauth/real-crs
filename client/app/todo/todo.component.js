'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }


  initFields() {    
    this.$http.get('/api/contacts/names')
      .then(response => {
        this.contactNameCollection = response.data;
      });  
  }

  addMessage() {
    var item = this;
    if(this.inputMessage && this.getCurrentUser().name) {
      this.$http.post('/api/messages', {
        title: this.taskName,
        message: this.inputMessage,
        contactID: this.inputName._id,
        contactName: this.inputName.name ? this.inputName.name : this.inputName,
        communicationType: this.inputCommunicationType,
        dueDate: this.inputDueDate,
        userID: this.getCurrentUser()._id,
        userName: this.getCurrentUser().name,
        isDone: false,
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

export default angular.module('realCrsApp.todo', [uiRouter])
  .config(routes)
  .component('todo', {
    template: require('./todo.html'),
    controller: TodoComponent,
    controllerAs: 'todoCtrl'
  })
  .name;
