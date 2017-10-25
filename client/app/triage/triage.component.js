'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
import moment from 'moment';
import routes from './triage.routes';

export class TriageComponent {
  /*@ngInject*/
  constructor($http, $scope, $filter, socket) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.$scope = $scope;

    this.$scope.$on('$destroy', function() {
      socket.unsyncUpdates('messages');
    });
  }

  $onInit() {
    this.$http.get('/api/messages')
      .then(response => {
        this.coll = response.data;
        this.messageCollection = this.coll.filter((coll) => coll.isDone == false)
        this.socket.syncUpdates('messages', this.messageCollection);
      });
  }

  openContact(contact) {

  }

  closeItem(triageItem) {
    var item = triageItem;
    this.$http.put('/api/messages/'  + triageItem._id, {
        isDone: true
      })
      .then(response => {
        var index = this.messageCollection.indexOf(item);
        console.log('index: ' + index);
        this.messageCollection.splice(index,1);
        this.socket.syncUpdates('messages', this.messageCollection);
      });
  }

  getFuzzyDate(date) {
    return moment(date).fromNow();
  }
}

export default angular.module('realCrsApp.triage', [uiRouter])
  .config(routes)
  .component('triage', {
    template: require('./triage.html'),
    controller: TriageComponent,
    controllerAs: 'triageCtrl'
  })
  .name;
