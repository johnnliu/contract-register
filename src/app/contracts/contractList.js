module.exports = {
    template: require('./contractList.html'),
    controller: ContractListController
};

var $ = require('jquery');
var ContractForm = require('./contractForm');

ContractListController.$inject = ['$scope', '$element', '$attrs', 'contractService', '$compile', '$kWindow'];
function ContractListController($scope, $element, $attrs, contractService, $compile, $kWindow) {
    var $ctrl = this;

    // This would be loaded by $http etc.
    $ctrl.source = null;
    $ctrl.openFormWindow = openFormWindow;
    $ctrl.refresh = refresh;

    activate();



    function activate() {
        $ctrl.source = new kendo.data.DataSource({
            data: [],
            pageSize: 20
        });
        $ctrl.gridOptions = {
            dataSource: $ctrl.source,
            sortable: true,
            columns: [
                {
                    field: "Title",
                    title: "Title",
                    template: function () {
                        return '<a ng-click="$ctrl.openFormWindow(dataItem)">{{dataItem.Title}}</a>';
                    }
                }, {
                    field: "ThirdPartyOrganisationName",
                    title: "Organisation"
                },
                {
                    command: ["edit", "destroy"],
                    title: ""
                }
            ]
        };

        $ctrl.refresh();
    }

    function refresh() {
        contractService.getItems().then(function (items) {
            $ctrl.source.data(items);
        });
    }

    function openFormWindow(dataItem) {

        // http://plnkr.co/edit/PjQdBUq0akXP2fn5sYZs?p=preview
        var windowInstance = $kWindow.open({
            options: {
                modal: true,
                title: dataItem.Title,
                resizable: true,
                height: 600,
                width: 400,
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
