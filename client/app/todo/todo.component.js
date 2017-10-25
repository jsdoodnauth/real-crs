'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
