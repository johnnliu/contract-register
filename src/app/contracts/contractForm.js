module.exports = {
  template: require('./contractForm.html'),
  controller: ContractFormController,
  bindings: {
    '$close': '&',
    '$dismiss': '&',
    'contractid': '<'
  }
};

ContractFormController.$inject = ['$scope', '$element', '$attrs', 'contractService'];
function ContractFormController($scope, $element, $attrs, contractService) {
  var $ctrl = this;

  $ctrl.item = {
    'Title': 'SAA',
    'ThirdPartyContactFullName': '',
    'ThirdPartyOrganisationName': '',
    'ThirdPartyContactEmail': '',
    'SystemName': '',
    'InformationDescription': '',
    'InformationSensitivity': 0,
    'InternalOwnerId': null,
    'ContractStartDate': null,
    'ContractEndDate': null
  };

  $ctrl.validate = validate;
  $ctrl.dismiss = dismiss;
  $ctrl.close = close;
  $ctrl.save = save;

  activate();

  function activate() {
    //ID is known get item refresh
    if ($ctrl.contractid) {
      contractService.getItem($ctrl.contractid).then(function (item) {
        $ctrl.item = item;
      });
    }
  }

  function validate(event) {
    //block submit from making a postback
    event.preventDefault();

    if ($ctrl.validator.validate()) {
      $ctrl.validationMessage = "";
      $ctrl.validationClass = "valid";
    } else {
      $ctrl.validationMessage = "There is invalid data in the form.";
      $ctrl.validationClass = "invalid";
    }
  }

  function save() {
    if (!$ctrl.validator.validate()) {
      $ctrl.validationMessage = "There is invalid data in the form.";
      $ctrl.validationClass = "invalid";
      return;
    }
    //ID is known update item
    if ($ctrl.contractid) {
      contractService.updateItem($ctrl.item).then(function () {
        $ctrl.close();
      });
    }
    else {
      //no ID add as new item
      contractService.newItem($ctrl.item).then(function () {
        $ctrl.close();
      });
    }
  }

  function close() {
    $ctrl.$close({
      result: 'save'
    });
  }

  function dismiss() {
    $ctrl.$dismiss({
      reason: 'cancel'
    });
  }

}
