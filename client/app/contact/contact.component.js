'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor() {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('keyword');
    });
  }

/*
  $onInit() {
    this.$http.get('/api/keywords')
      .then(response => {
        this.keywordCollection = response.data;
        this.socket.syncUpdates('keyword', this.keywordCollection);
      });
  }

  addKeyword() {
    console.log('addKeyword()');
    if(this.keywordName) {
      this.$http.post('/api/keywords', {
        name: this.keywordName,
        category: this.keywordCategory
      });
      this.keywordName = '';
      this.keywordCategory = '';
    }
  }
*/
}

export default angular.module('realCrsApp.contact', [uiRouter])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: 'contactCtrl'
  })
  .name;
