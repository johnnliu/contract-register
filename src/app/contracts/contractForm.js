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

  $ctrl.item = null;

  $ctrl.activate = activate;
  $ctrl.validate = validate;
  $ctrl.dismiss = dismiss;
  $ctrl.close = close;
  $ctrl.save = save;

  activate();

  function activate() {
    //TODO
    contractService.getItem($ctrl.contractid).then(function (item) {
      $ctrl.item = item;

    });
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
    if ($ctrl.validator.validate()) {
      //TODO
      contractService.updateItem($ctrl.item).then(function(item){
        
        $ctrl.close();
      });
    }
    else {
      $ctrl.validationMessage = "There is invalid data in the form.";
      $ctrl.validationClass = "invalid";
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
