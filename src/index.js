var $ = require('jquery');
var angular = require('angular');
var kendo = require('kendo');
var ContractService = require('./app/contracts/contractService');
var App = require('./app/containers/App');
var ContractList = require('./app/contracts/contractList');
var ContractForm = require('./app/contracts/contractForm');
require('./index.css');
require("kendo/css/web/kendo.common-office365.css");
require("kendo/css/web/kendo.office365.css");

//var app = 'app';

var app = angular
  .module('app', ['kendo.directives', 'kendo.window']);

app.service('contractService', ContractService);

app.component('app', App);

app.component('contractList', ContractList);

app.component('contractForm', ContractForm);
