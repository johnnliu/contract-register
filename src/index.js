var $ = require('jquery');
var angular = require('angular');
var kendo = require('kendo');
var angularKendoWindow = require('../lib/angular-kendo-window.js');
var ContractService = require('./app/contracts/contractService');
var App = require('./app/containers/App');
var ContractList = require('./app/contracts/contractList');
var ContractForm = require('./app/contracts/contractForm');
require('./index.css');

var app = angular
  .module('app', ['kendo.directives', 'kendo.window']);

app.service('contractService', ContractService);

app.component('app', App);

app.component('contractList', ContractList);

app.component('contractForm', ContractForm);
