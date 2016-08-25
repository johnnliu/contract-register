module.exports = {
  template: require('./contractForm.html'),
  controller: ContractFormController,
  bindings: {
    '$close': '&',
    '$dismiss': '&',
    'contractid': '<'
  }
};

var kendo = require('kendo');
var $ = require('jquery');

ContractFormController.$inject = ['$scope', '$element', '$attrs', 'contractService', '$kWindow'];
function ContractFormController($scope, $element, $attrs, contractService, $kWindow) {
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
  $ctrl.generatePdf = generatePdf;
  $ctrl.openUploadWindow = openUploadWindow;

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

  function generatePdf(selector) {
    kendo.drawing.drawDOM($(selector)).then(function (group) {
      kendo.drawing.pdf.saveAs(group, "contract.pdf");
    });
  }

  function openUploadWindow() {
    // http://plnkr.co/edit/PjQdBUq0akXP2fn5sYZs?p=preview
    var windowInstance = $kWindow.open({
      options: {
        modal: true,
        title: 'Upload Contract',
        resizable: true,
        visible: false
      },
      template: '<div style="width:400px" class="k-content"><input kendo-upload k-select="$ctrl.onSelect" name="files" id="files" type="file" /><p style="padding-top: 1em; text-align: right"><button kendo-button class="k-button" ng-click="$ctrl.uploadContract()">Submit</button></p></div>',
      controller: ['contractUpload', 'contractid', '$scope', function (contractUpload, contractid, $scope) {
        var $ctrl = this;

        $ctrl.uploadContract = uploadContract;
        $ctrl.onSelect = onSelect;
        $ctrl.contractid = contractid;
        $ctrl.$close = $scope.$close;
        $ctrl.reader = null;
        $ctrl.file = null;

        function uploadContract() {
          if (!$ctrl.file) return;
          if (window.FileReader) {
            $ctrl.reader = new FileReader();
            $ctrl.reader.onload = receivedBinary;
            $ctrl.reader.readAsArrayBuffer($ctrl.file);
          }
        }

        function onSelect(e) {
          $ctrl.file = e.files[0].rawFile;
        }

        function receivedBinary(event) {
          var id = $ctrl.contractid;
          var name = $ctrl.file.name;
          var content = event.target.result;
          contractService.attachDocument(id, name, content).then(function () {
            //alert("successful");
            $ctrl.$close();
          }, function () {
            alert("failed");
          });
        }
      }],
      controllerAs: '$ctrl',
      resolve: {
        contractUpload: function () {
          return '';
        },
        contractid: $ctrl.contractid
      }
    });

    windowInstance.result.then(function (result) {
      if (result) {
        $scope.result = 'confirmed!';
        //$ctrl.refresh();
      }
      else {
        $scope.result = 'canceled!';
      }
    });
  }

}
