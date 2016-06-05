'use strict';
(function(){

class Sta001Component {
  constructor($http, $scope, socket) {

    // APP
      this.$http = $http;
      this.socket = socket;
      this.sta001s = [];
      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('sta001');
      });
      this.productBarcodeEncoding = [['A', 'A'], ['A', 'B'], ['A', 'C'], ['A', 'D'], ['B', 'A'], ['B', 'B'], ['B', 'C'], ['B', 'D'], ['C', 'A'], ['C', 'B']];
      this.kitBarcodeEncoding = [[['A0', 'A']], [['A1', 'A'], ['A2', 'A']], [['A3', 'A'], ['A4', 'A'], ['A5', 'A']], [['A6', 'A'], ['A7', 'A'], ['A8', 'A'], ['A9', 'A']], [['A$', 'A'], ['A-', 'A'], ['A:', 'A'], ['A/', 'A'], ['A.', 'A']], [['A+', 'A'], ['A0', 'B'], ['A1', 'B'], ['A2', 'B'], ['A3', 'B'], ['A4', 'B']], [['A5', 'B'], ['A6', 'B'], ['A7', 'B'], ['A8', 'B'], ['A9', 'B'], ['A$', 'B'], ['A-', 'B']], [['A:', 'B'], ['A/', 'B'], ['A.', 'B'], ['A+', 'B'], ['A0', 'C'], ['A1', 'C'], ['A2', 'C'], ['A3', 'C']], [['A4', 'C'], ['A5', 'C'], ['A6', 'C'], ['A7', 'C'], ['A8', 'C'], ['A9', 'C'], ['A$', 'C'], ['A-', 'C'], ['A:', 'C']], [['A/', 'C'], ['A.', 'C'], ['A+', 'C'], ['A0', 'D'], ['A1', 'D'], ['A2', 'D'], ['A3', 'D'], ['A4', 'D'], ['A5', 'D'], ['A6', 'D']], [['A7', 'D'], ['A8', 'D'], ['A9', 'D'], ['A$', 'D'], ['A-', 'D'], ['A:', 'D'], ['A/', 'D'], ['A.', 'D'], ['A+', 'D'], ['B0', 'A'], ['B1', 'A']], [['B2', 'A'], ['B3', 'A'], ['B4', 'A'], ['B5', 'A'], ['B6', 'A'], ['B7', 'A'], ['B8', 'A'], ['B9', 'A'], ['B$', 'A'], ['B-', 'A'], ['B:', 'A'], ['B/', 'A']], [['B.', 'A'], ['B+', 'A'], ['B0', 'B'], ['B1', 'B'], ['B2', 'B'], ['B3', 'B'], ['B4', 'B'], ['B5', 'B'], ['B6', 'B'], ['B7', 'B'], ['B8', 'B'], ['B9', 'B'], ['B$', 'B']], [['B-', 'B'], ['B:', 'B'], ['B/', 'B'], ['B.', 'B'], ['B+', 'B'], ['B0', 'C'], ['B1', 'C'], ['B2', 'C'], ['B3', 'C'], ['B4', 'C'], ['B5', 'C'], ['B6', 'C'], ['B7', 'C'], ['B8', 'C']], [['B9', 'C'], ['B$', 'C'], ['B-', 'C'], ['B:', 'C'], ['B/', 'C'], ['B.', 'C'], ['B+', 'C'], ['B0', 'D'], ['B1', 'D'], ['B2', 'D'], ['B3', 'D'], ['B4', 'D'], ['B5', 'D'], ['B6', 'D'], ['B7', 'D']], [['B8', 'D'], ['B9', 'D'], ['B$', 'D'], ['B-', 'D'], ['B:', 'D'], ['B/', 'D'], ['B.', 'D'], ['B+', 'D'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A']], [['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B']], [['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C']], [['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D']], [['C', 'D'], ['C', 'D'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'B'], ['D', 'B']]];
      this.kitBarcodeEncodingCut = 15;

      this.generateVisible = false;
      this.manageVisible = false;
      this.importVisible = false;
      this.exportVisible = false;
      this.detailVisible = false;

      this.isModeUpdate = false;
      this.updateId = "";


    // IMPORT
      this.decodes = [];

    // MANAGE
      $scope.sortType     = '_id'; // set the default sort type
      $scope.sortReverse  = false;  // set the default sort order
      $scope.filters = {
        searchKit: ''
      }

    // GENERATE
      this.formSta001 = {
        i: {
          parameters: [],
          productCodes: []
        },
        o: {
          parameters: [],
          productBarcodes: [],
          kitBarcode: "",
          kitBarcodeLines: []
        }
      };

  }

  // GENERATE
    generate() {
      this.generateParameters();
      this.generateProductBarcodes();
      this.generateKitBarcode();
    }
    generateParameters() {
      if (this.formSta001.i.parameters) {
        for (var i in this.formSta001.i.parameters) {
          var parameter = this.formSta001.i.parameters[i.toString()];
          var s = "";
          s+= parameter.replace(/[.]+/g, '');
          this.formSta001.o.parameters[i] = s;
        }
      }
    }
    parametersCountChange() {
      var fromLength = this.formSta001.o.parameters.length;
      var toLength = this.formSta001.i.parametersCount;
      if (fromLength < toLength) {
        while(this.formSta001.o.parameters.length < toLength) {
          this.formSta001.o.parameters.push("");
        }
      } else if (fromLength > toLength) {
        while(this.formSta001.o.parameters.length > toLength) {
          this.formSta001.o.parameters.pop();
        }
      }
    }

    generateProductBarcodes() {
      if (this.formSta001.i.kitLot) {
        var kitLot = this.formSta001.i.kitLot;
        for (var i in this.formSta001.i.productCodes) {
          if (this.formSta001.i.productCodes[i.toString()]) {
          var productCode = this.formSta001.i.productCodes[i.toString()];
          var product = "";
          product+= this.productBarcodeEncoding[Number(kitLot.substr(3,1))][0];
          product+= this.hex2cod(Number(productCode).toString(16).toUpperCase()); // to hex hexString = yourNumber.toString(16); reverse with yourNumber = parseInt(hexString, 16);
          product+= kitLot.substr(4);
          product+= this.productBarcodeEncoding[Number(kitLot.substr(3,1))][1];
          this.formSta001.o.productBarcodes[i] = product;
          }
        }
      }
      // if (this.isProductBarcodesPreviewEnabled) {
        this.generateProductBarcodesPreview();
      // }
    }
    generateProductBarcodesPreview() {
      console.log("generateProductBarcodesPreview()");
      if (document.body.getElementsByClassName('list-unstyled productBarcodesPreview col-lg-12')[0]) {
        var img = document.body.getElementsByClassName('list-unstyled productBarcodesPreview col-lg-12')[0];
        while (img.firstChild) {
          img.removeChild(img.firstChild);
        }
        for (var i = 0; i < this.formSta001.o.productBarcodes.length; i++) {
          var l = document.createElement("li");
          img.appendChild(l);
          var c = document.createElement("canvas");
          c.className += "col-lg-12";
          l.appendChild(c);
          JsBarcode(c, this.formSta001.o.productBarcodes[i], {
            height:30
          });
        }
      };
    }
    productsCountChange() {
      var fromLength = this.formSta001.o.productBarcodes.length;
      var toLength = this.formSta001.i.productsCount;
      if (fromLength < toLength) {
        while(this.formSta001.o.productBarcodes.length < toLength) {
          this.formSta001.o.productBarcodes.push("");
        }
      } else if (fromLength > toLength) {
        while(this.formSta001.o.productBarcodes.length > toLength) {
          this.formSta001.o.productBarcodes.pop();
        }
      }
    }

    generateKitBarcode() {
      var kit = "";
      if (this.formSta001.i.kitLot) {
        var kitLot = this.formSta001.i.kitLot;
        kit += kitLot;
      }
      if (this.formSta001.i.kitCode) {
        var kitCode = this.formSta001.i.kitCode;
        kit += kitCode;
      }
      if (this.formSta001.i.kitExpiry) {
        var kitExpiry = this.formSta001.i.kitExpiry;
        kit += kitExpiry;
      }
      if (this.formSta001.i.productsCount) {
        var productsCount = this.formSta001.i.productsCount;
        kit += productsCount;
      }
      if (this.formSta001.i.productCodes) {
        for (var i in this.formSta001.i.productCodes) {
          var productCode = this.formSta001.i.productCodes[i.toString()];
          kit += productCode;
        }
      }
      for (var i = 0; i < this.formSta001.o.parameters.length; i++) {
        var parameter = this.formSta001.o.parameters[i];
        kit += parameter;
      }
      var CS = this.generateKitBarcodeCS(kit);
      kit += CS;
      this.formSta001.o.kitBarcode = kit;
      this.generateKitBarcodeLines();
      // if (this.isKitBarcodePreviewEnabled) {
        this.generateKitBarcodePreview();
      // }
    }
    generateKitBarcodeCS(kit) {
      var I = new String(kit);
      var chk = I.charCodeAt(0).toString(16).toUpperCase(); //hex
      for (var i = 1; i < I.length; i++) {
        chk = (parseInt(chk, 16) ^ I.charCodeAt(i)).toString(16).toUpperCase(); // xor only work on javascript numeric values
      }
      chk = (parseInt(chk, 16) | parseInt('40', 16)).toString(16).toUpperCase();
      var pF = ((parseInt(chk, 16) & parseInt('F0', 16)) / 16).toString(16).toUpperCase();
      pF = this.hex2cod(pF);
      var pf = ((parseInt(chk, 16) & parseInt('0F', 16))).toString(16).toUpperCase();
      pf = this.hex2cod(pf);
      var CS = pF+pf;
      return CS;
    }
    generateKitBarcodeLines() {
      this.formSta001.o.kitBarcodeLines=[];
      var barcode = this.formSta001.o.kitBarcode;
      var search = new RegExp(".{1,"+this.kitBarcodeEncodingCut+"}","g")
      var chunks = barcode.match(search);
      for (var i = 0; i < chunks.length; i++) {
        var line = this.kitBarcodeEncoding[chunks.length-1][i][0]+
          chunks[i]+
          this.kitBarcodeEncoding[chunks.length-1][i][1];
        this.formSta001.o.kitBarcodeLines.push(line);
      
      }
    }
    generateKitBarcodePreview() {
      console.log("generateKitBarcodePreview()");
      if ( document.body.getElementsByClassName('kitBarcodePreview')[0] ) {
        var O = document.body.getElementsByClassName('kitBarcodePreview')[0];
        while (O.firstChild) {
          O.removeChild(O.firstChild);
        }
        for (var i = 0; i < this.formSta001.o.kitBarcodeLines.length; i++) {
          var l = document.createElement("li");
          O.appendChild(l);
          var c = document.createElement("canvas");
          c.className += "col-lg-12";
          l.appendChild(c);
          JsBarcode(c, this.formSta001.o.kitBarcodeLines[i], {
            height:30
          });
        }
      }
    }

    createSta001() {
      console.log(this.formSta001);
      this.$http.post('/api/sta001s', this.formSta001);
      this.generateVisible = false;
      this.clearSta001();
      this.manageVisible = true;
    }
    updateSta001() {
      this.$http.put('/api/sta001s/' + this.updateId, this.formSta001);
      this.updateId = "";
      this.generateVisible = false;
      this.clearSta001();
      this.manageVisible = true;
    }
    clearSta001() {
      this.formSta001 = {
        i: {
          parameters: [],
          productCodes: []
        },
        o: {
          parameters: [],
          productBarcodes: [],
          kitBarcode: "",
          kitBarcodeLines: []
        }
      };
      // this.isProductBarcodesPreviewEnabled = false;
      // this.isKitBarcodePreviewEnabled = false;
      this.isModeUpdate = false;
    }

  // MANAGE
    deleteSta001(sta001) {
      this.$http.delete('/api/sta001s/' + sta001._id);
    }
    invertSta001Online(sta001) {
      var inv = !sta001.online;
      this.$http.patch('/api/sta001s/' + sta001._id, { online: inv});
    }
    copySta001(sta001) {
      this.formSta001.i = sta001.i;
      this.generate();
      this.generateVisible = true;
    }
    editSta001(sta001) {
      this.updateId = sta001._id;
      this.formSta001 = sta001;
      // delete this.formSta001.kitBarcode;
      this.isModeUpdate = true;
      this.generateVisible = true;
    }
    exportSta001(sta001) {
      this.formSta001 = sta001;
      this.exportVisible = true;
      this.manageVisible = false;
      this.generate();
      // delete this.formSta001.kitBarcode;
      // this.isModeUpdate = true;
      // this.generateVisible = true;
    }

  // IMPORT
    onSuccess(response) {
      for (var i = 0; i < response.data.length; i++) {
        this.decodes.push(response.data[i]);
      }
      this.loaderVisible = true;
    }

    importLoad(index) {
      this.formSta001.i = this.decodes[index].i;
      this.generate();
      this.generateVisible = true;
      this.importVisible = false;
      this.decodes.splice(index, 1);
    }

    importClear() {

    }

  // HELPERS
    hex2cod(si) {
      var so = "";
      for (var i = 0; i < si.length; i++) {
        switch (si.charAt(i)) {
          case '0':
            so+=  '0';
            break;
          case '1':
            so+=  '1';
            break;
          case '2':
            so+=  '2';
            break;
          case '3':
            so+=  '3';
            break;
          case '4':
            so+=  '4';
            break;
          case '5':
            so+=  '5';
            break;
          case '6':
            so+=  '6';
            break;
          case '7':
            so+=  '7';
            break;
          case '8':
            so+=  '8';
            break;
          case '9':
            so+=  '9';
            break;
          case 'A':
            so+=  '$';
            break;
          case 'B':
            so+=  '-';
            break;
          case 'C':
            so+=  ':';
            break;
          case 'D':
            so+=  '/';
            break;
          case 'E':
            so+=  '.';
            break;
          case 'F':
            so+=  '+';
            break;
          default:
            console.log("\n### error in hex2cod() ###\n");
            break;
        }
      }
      return so;
    }
    $onInit() {
      this.$http.get('/api/sta001s').then(response => {
        this.sta001s = response.data;
        this.socket.syncUpdates('sta001', this.sta001s);
      });
    }
    clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          if (attr.charAt(0) != '_' && attr.charAt(0) != '$') {copy[attr] = obj[attr];}
        }
      }
      return copy;
    }
}

angular.module('aliimsApp')
  .component('sta001', {
    templateUrl: 'app/sta001/sta001.html',
    controller: Sta001Component
  });

})();
