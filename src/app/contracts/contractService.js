

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
            pnp.sp.web.lists.getByTitle("Heroes").items().getById(id).then(function(result){
                
            });
        });
    }

    function updateItem(contract) {

    }

    function getList() {
        return $q(function (resolve, reject) {
            pnp.sp.web.lists.ensure("ContractRegister","").then(function (result) {
                if (result.created) {
                     //http://officedev.github.io/PnP-JS-Core/classes/_sharepoint_rest_fields_.fields.html#add
                    result.list.fields.addText('Organisation').then(function(){
                        // add some demo entries
                        $q.all([
                            result.list.items.add({ Title: "Superman", 'Organisation': 'Krypton' }),
                            result.list.items.add({ Title: "Batman", 'Organisation': 'WayneCorp' }),
                            result.list.items.add({ Title: "Captain Kirk", 'Organisation': 'Starfleet' })
                        ]).then(function () { resolve(result.list); });
                    })

                } else {
                    resolve(result.list);
                }
            });
        });
    }


}
