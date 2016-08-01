module.exports = {
    template: require('./contractList.html'),
    controller: ContractListController
};

var $ = require('jquery');
var ContractForm = require('./contractForm');

ContractListController.$inject = ['$scope', '$element', '$attrs', 'contractService', '$compile', '$kWindow'];
function ContractListController($scope, $element, $attrs, contractService, $compile, $kWindow) {
    var $ctrl = this;

    $ctrl.source = null;
    $ctrl.openFormWindow = openFormWindow;
    $ctrl.refresh = refresh;
    $ctrl.newContract = newContract;

    activate();


    function activate() {
        $ctrl.source = new kendo.data.DataSource({
            data: [],
            schema: {
                    model: {
                        fields: {
                            Title: { type: 'string' },
                            SystemName: { type: 'string' },
                            ThirdPartyContactFullName: { type: 'string' },
                            ThirdPartyOrganisationName: { type: 'string' },
                            ContractStartDate: { type: 'date' },
                            ContractEndDate: { type: 'date' }
                        }
                    }
                }
        });
        $ctrl.gridOptions = {
            dataSource: $ctrl.source,
            sortable: true,
            filterable: true,
            groupable: true,
            columns: [
                {
                    field: 'Title',
                    title: 'Contract No',
                    filterable:false,
                    template: function () {
                        return '<a ng-click="$ctrl.openFormWindow(dataItem)">{{dataItem.Title}}</a>';
                    }
                }, 
                {
                    field: 'SystemName',
                    title: 'System Name',
                    filterable: { multi: true }
                },
                {
                    field: 'ThirdPartyContactFullName',
                    title: 'Full Name',
                    filterable: { multi: true }
                },
                {
                    field: 'ThirdPartyOrganisationName',
                    title: 'Organisation',
                    filterable: { multi: true }
                },
                {
                    field: 'ContractStartDate',
                    title: 'Start Date',
                    template: "#= kendo.toString(new Date(ContractStartDate), 'dd-MM-yyyy') #",
                    type: 'date'
                },
                {
                    field: 'ContractEndDate',
                    title: 'End Date',
                    template: "#= kendo.toString(new Date(ContractEndDate), 'dd-MM-yyyy') #",
                    type: 'date'
                },
                {
                    command: ['edit', 'destroy'],
                    title: '',
                    filterable:false,
                    sortable:false
                }
            ],
            toolbar: [
            {
              name: "add",
              text: "New Contract",
              template: '<a ng-click="$ctrl.newContract()" class="k-button k-button-icontext k-grid-add" href="\\#">New Contract</a>'	
            }]
        };

        $ctrl.refresh();
    }

    function refresh() {
        contractService.getItems().then(function (items) {
            $ctrl.source.data(items);
        });
    }

    function newContract(){
        openFormWindow({Title:'New Contract', Id:null});
    }

    function openFormWindow(dataItem) {
        // http://plnkr.co/edit/PjQdBUq0akXP2fn5sYZs?p=preview
        var windowInstance = $kWindow.open({
            options: {
                modal: true,
                title: dataItem.Title,
                resizable: true,
                visible: false
            },
            template: '<contract-form contractid="$ctrl.contractid" $close="$close(result)" $dismiss="$dismiss(reason)"></contract-form>',
            controller: ['contractid', function (contractid) {
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
                $ctrl.refresh();
            }
            else {
                $scope.result = 'canceled!';
            }
        });
    }
}
