'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('realCrsApp.login', [])
  .controller('LoginController', LoginController)
  .name;
