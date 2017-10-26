'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  },
  {
    title: 'Quick Note',
    state: 'quickadd',
    admin: true
  },
  {
    title: 'Triage',
    state: 'triage',
    admin: true
  },
  {
    title: 'Contacts',
    state: 'contacts'
  },
  {
    title: 'Todo',
    state: 'todo',
    admin: true
  }];

  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
