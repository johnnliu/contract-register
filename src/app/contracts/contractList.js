module.exports = {
  template: require('./contractList.html'),
  controller: ContractListController
};

var $ = require('jquery');
var ContractForm = require('./contractForm');
//var ContractWindowTemplate = require('./contractWindow.html');

ContractListController.$inject = ['$scope', '$element', '$attrs', 'contractService', '$compile', '$kWindow'];
function ContractListController($scope, $element, $attrs, contractService, $compile, $kWindow) {
  var $ctrl = this;
  
  // This would be loaded by $http etc.
  $ctrl.list = [];
  $ctrl.source = null;
  $ctrl.updateHero = updateHero; 
  $ctrl.deleteHero = deleteHero; 
  $ctrl.openFormWindow = openFormWindow;

  activate();



  function activate() {

    $ctrl.source = new kendo.data.DataSource({
        data: [],
        pageSize: 21
    }); 

    contractService.getItems().then(function(items){
      $ctrl.list = items;
      $ctrl.source.data(items);
      $ctrl.gridOptions = {
                dataSource: $ctrl.source,
                sortable: true,
                columns: [{
                        field: "Title",
                        title: "Title",
                        template:function() {
                          return '<a ng-click="$ctrl.openFormWindow(dataItem)">{{dataItem.Title}}</a>';
                        }
                    },{
                        field: "Organisation",
                        title: "Organisation"
                        },
                        {
                     command: ["edit", "destroy"],
                     title: ""
                 }]
      }

    });

    // service
  }

  function updateHero(hero, prop, value) {
    hero[prop] = value;
  }

  function deleteHero(hero) {
    var idx = $ctrl.list.indexOf(hero);
    if (idx >= 0) {
      $ctrl.list.splice(idx, 1);
    }
  }

  function openFormWindow(dataItem){

    // http://plnkr.co/edit/PjQdBUq0akXP2fn5sYZs?p=preview
    var windowInstance = $kWindow.open({
        options:{
            modal: true,
            title: dataItem.Title,
            resizable: true,
            height: 600,
            width: 400,
            visible: false
        },
            template: '<contract-form contractid="$ctrl.contractid" $close="$close(result)" $dismiss="$dismiss(reason)"></contract-form>',
            controller: ['contractid', function(contractid) {
                    var $ctrl = this;
                    $ctrl.contractid = contractid;
                    //$ctrl.modalData = modalData;
                }],
            controllerAs: '$ctrl',
            resolve: {
                contractid: function () {
                    return dataItem.Id;
                }
            }
      });

    windowInstance.result.then(function (result) {
        if (result) {
            $scope.result = 'confirmed!';
        }
        else{
            $scope.result = 'canceled!';
        }
    });
/*
    var kendoWindowOptions = {
        width: "505px",
        height: "315px",
        title: "hero:" + id,
        actions: ["Refresh", "Maximize", "Close"]
    };

    //var content = ContractWindowTemplate.replace("{{id}}", id);

    var templateFn = $compile(ContractForm.template);
    var content = templateFn(ContractForm.controller);

    $('<div />')
      .appendTo(document.body)
      .kendoWindow(kendoWindowOptions)
      .data('kendoWindow')
      .content(content)
      .center()
      .open();
    
    //formWindow.data("kendoWindow").open();
*/
  }
}

function ContractFormWindow(id) {
    var $ctrl = this;

    $ctrl.contractid = id;
}
