module.exports = ContractService;

//We use PnP for all SharePoint
var pnp = require('sp-pnp-js');

//added here and as webpack external to prevent compile warnings
var _spPageContextInfo = require('_spPageContextInfo');

//Angular promises
ContractService.$inject = ['$q'];

function ContractService($q) {
    var self = this;

    self.getItems = getItems;
    self.newItem = newItem;
    self.getItem = getItem;
    self.updateItem = updateItem;

    self.attachDocument = attachDocument; 
    function getItems() {
        return $q(function(resolve,reject){
            getList().then(function (list) {
                list.items.get().then(function (items) {
                    resolve(items);
                });
            }).catch(reject);
        });
    }

    function newItem(item) {
        return $q(function (resolve, reject) {
            //http://officedev.github.io/PnP-JS-Core/classes/_sharepoint_rest_items_.items.html#add
            getList().then(function (list) {
                list.items.add(item).then(function (newItemResult) {
                    resolve(newItemResult.item);
                }).catch(reject);
            }).catch(reject);
        });
    }

    function getItem(id) {
        return $q(function (resolve, reject) {
            // https://blogs.msdn.microsoft.com/patrickrodgers/2016/06/28/pnp-jscore-1-0-2/
            getList().then(function (list) {
                list.items.getById(id).get().then(function (result) {
                    resolve(result);
                }).catch(reject);
            }).catch(reject);
        });
    }

    function updateItem(item) {
        return $q(function (resolve, reject) {

            var etag = item['odata.etag'] || '*';

            // https://blogs.msdn.microsoft.com/patrickrodgers/2016/06/06/pnp-js-library-1-0-0/
            getList().then(function (list) {
                list.items.getById(item.Id).update(item, etag).then(function (itemUpdateResult) {
                    resolve(itemUpdateResult.item);
                }).catch(reject);
            }).catch(reject);
        });
    }

    function getList() {
        return $q(function (resolve, reject) {
            pnp.sp.web.lists.ensure('ContractRegister', '').then(function (result) {
                if (result.created) {
                    setupContractRegister(result.list).then(function (list) {
                        resolve(list);
                    });
                } else {
                    resolve(result.list);
                }
            }).catch(reject);
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
                    list.items.add({'Title': 'SAA-001', 
                                    'ThirdPartyContactFullName':'Superman', 
                                    'ThirdPartyOrganisationName': 'Krypton', 
                                    'ThirdPartyContactEmail':'super@man.com', 
                                    'SystemName': 'Daily Planet Archive',
                                    'InformationDescription':'',
                                    'InformationSensitivity': 3,
                                    //Need to append Id to internal name
                                    'InternalOwnerId': _spPageContextInfo.userId, 
                                    'ContractStartDate':'2016-01-01' , 
                                    'ContractEndDate':'2016-03-01' }),
                    list.items.add({'Title': 'SAA-002', 
                                    'ThirdPartyContactFullName':'Batman', 
                                    'ThirdPartyOrganisationName': 'WayneCorp',
                                    'ThirdPartyContactEmail':'bat@man.com', 
                                    'SystemName': 'Surveillance System', 
                                    'InformationDescription': 'City-wide surveillance system created through high-frequency sonar signals captured from millions of cell phones, the power to visualize the locations of criminals throughout the city of Gotham. ', 
                                    'InformationSensitivity': 5,
                                    'InternalOwnerId': _spPageContextInfo.userId, 
                                    'ContractStartDate':'2015-08-01' , 
                                    'ContractEndDate':'2017-08-01' }),
                    list.items.add({'Title': 'SAA-003', 
                                    'ThirdPartyContactFullName':'Captain Kirk', 
                                    'ThirdPartyOrganisationName': 'Starfleet', 
                                    'SystemName': '',
                                    'InformationDescription':'',
                                    'InformationSensitivity': 1,
                                    'InternalOwnerId': _spPageContextInfo.userId,
                                    'ContractStartDate':'2015-08-01' , 
                                    'ContractEndDate':'2017-08-01' 
                                })
                ]).then(function () {
                    //resolve the list like it has always been there.. 
                    resolve(list);
                });
            }).catch(reject);

            batch1.execute();

        });
    }
    
    function attachDocument(id, url, content) {
        return $q(function (resolve, reject) {
            //http://officedev.github.io/PnP-JS-Core/classes/_sharepoint_rest_items_.items.html#add
            
            // this is a tweaked pnp item 
            pnp.sp.web.lists.getByTitle('ContractRegister').items.getById(id).attachmentFiles.
                addAttachment(url, content).then(function () {
                    resolve();
                }).catch(reject);

        });
    
    }
}
