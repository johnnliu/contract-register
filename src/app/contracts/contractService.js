

module.exports = ContractService;

var pnp = require('sp-pnp-js');

ContractService.$inject = ['$q', '$timeout'];
function ContractService($q, $timeout) {
    var self = this;

    self.getItems = getItems;
    self.newItem = newItem;
    self.getItem = getItem;
    self.updateItem = updateItem;

    function getItems() {
        var deferred = $q.defer();

        // replace with pnp.sp.core

        getList().then(function (list) {
            list.items.get().then(function (items) {
                deferred.resolve(items);
            });
        })

        return deferred.promise;
    }

    function newItem() {

    }

    function getItem(id) {
        return $q(function (resolve, reject) {
            pnp.sp.web.lists.getByTitle("Heroes").items().getById(id).then(function (result) {

            });
        });
    }

    function updateItem(contract) {

    }

    function getList() {
        return $q(function (resolve, reject) {
            pnp.sp.web.lists.ensure("ContractRegister", "").then(function (result) {
                if (result.created) {
                    setupContractRegister(result.list).then(function (list) {
                        resolve(list);
                    });
                } else {
                    resolve(result.list);
                }
            });
        });
    }

    function setupContractRegister(list) {
        return $q(function (resolve, reject) {
            // http://officedev.github.io/PnP-JS-Core/classes/_sharepoint_rest_fields_.fields.html#add
            // add contract fields
            var batch1 = pnp.sp.createBatch();
            $q.all([
                //Information System Details
                list.fields.inBatch(batch1).addText('SystemName'),
                list.fields.inBatch(batch1).addMultilineText('InformationDescription', 8, false),
                list.fields.inBatch(batch1).addNumber('InformationSensitivity'),
                //Details of the third party
                list.fields.inBatch(batch1).addText('ThirdPartyContactFullName'),
                list.fields.inBatch(batch1).addText('ThirdPartyOrganisationName'),
                list.fields.inBatch(batch1).addText('ThirdPartyContactEmail'),
                //Internal Representative
                list.fields.inBatch(batch1).add('InternalOwner', 'SP.FieldUser', { 'FieldTypeKind': 20 }),
                //schedule period
                list.fields.inBatch(batch1).addDateTime('ContractStartDate'),
                list.fields.inBatch(batch1).addDateTime('ContractEndDate')
            ]).then(function () {
                // add some demo entries
                $q.all([
                    list.items.add({ Title: "Superman", 'ThirdPartyOrganisationName': 'Krypton' }),
                    list.items.add({ Title: "Batman", 'ThirdPartyOrganisationName': 'WayneCorp' }),
                    list.items.add({ Title: "Captain Kirk", 'ThirdPartyOrganisationName': 'Starfleet' })
                ]).then(function () {
                    //resolve the list like it has always been there.. 
                    resolve(list);
                });
            });

            batch1.execute();

        });
    }
}
