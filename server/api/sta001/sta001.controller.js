/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sta001s              ->  index
 * POST    /api/sta001s              ->  create
 * GET     /api/sta001s/:id          ->  show
 * PUT     /api/sta001s/:id          ->  update
 * DELETE  /api/sta001s/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Sta001 from './sta001.model';

import fs from 'fs';
import pdfText from 'pdf-text';
// import pdf_to_text from 'pdf-to-text';


var kitBarcodeEncodingCut = 15;
var kitBarcodeDecoding = ['A0', 'A1', 'A3', 'A6', 'A$', 'A+', 'A5', 'A:', 'A4', 'A/', 'A7', 'B2', 'B.', 'B-', 'B9', 'B8'];
var kitBarcodeEncoding = [[['A0', 'A']], [['A1', 'A'], ['A2', 'A']], [['A3', 'A'], ['A4', 'A'], ['A5', 'A']], [['A6', 'A'], ['A7', 'A'], ['A8', 'A'], ['A9', 'A']], [['A$', 'A'], ['A-', 'A'], ['A:', 'A'], ['A/', 'A'], ['A.', 'A']], [['A+', 'A'], ['A0', 'B'], ['A1', 'B'], ['A2', 'B'], ['A3', 'B'], ['A4', 'B']], [['A5', 'B'], ['A6', 'B'], ['A7', 'B'], ['A8', 'B'], ['A9', 'B'], ['A$', 'B'], ['A-', 'B']], [['A:', 'B'], ['A/', 'B'], ['A.', 'B'], ['A+', 'B'], ['A0', 'C'], ['A1', 'C'], ['A2', 'C'], ['A3', 'C']], [['A4', 'C'], ['A5', 'C'], ['A6', 'C'], ['A7', 'C'], ['A8', 'C'], ['A9', 'C'], ['A$', 'C'], ['A-', 'C'], ['A:', 'C']], [['A/', 'C'], ['A.', 'C'], ['A+', 'C'], ['A0', 'D'], ['A1', 'D'], ['A2', 'D'], ['A3', 'D'], ['A4', 'D'], ['A5', 'D'], ['A6', 'D']], [['A7', 'D'], ['A8', 'D'], ['A9', 'D'], ['A$', 'D'], ['A-', 'D'], ['A:', 'D'], ['A/', 'D'], ['A.', 'D'], ['A+', 'D'], ['B0', 'A'], ['B1', 'A']], [['B2', 'A'], ['B3', 'A'], ['B4', 'A'], ['B5', 'A'], ['B6', 'A'], ['B7', 'A'], ['B8', 'A'], ['B9', 'A'], ['B$', 'A'], ['B-', 'A'], ['B:', 'A'], ['B/', 'A']], [['B.', 'A'], ['B+', 'A'], ['B0', 'B'], ['B1', 'B'], ['B2', 'B'], ['B3', 'B'], ['B4', 'B'], ['B5', 'B'], ['B6', 'B'], ['B7', 'B'], ['B8', 'B'], ['B9', 'B'], ['B$', 'B']], [['B-', 'B'], ['B:', 'B'], ['B/', 'B'], ['B.', 'B'], ['B+', 'B'], ['B0', 'C'], ['B1', 'C'], ['B2', 'C'], ['B3', 'C'], ['B4', 'C'], ['B5', 'C'], ['B6', 'C'], ['B7', 'C'], ['B8', 'C']], [['B9', 'C'], ['B$', 'C'], ['B-', 'C'], ['B:', 'C'], ['B/', 'C'], ['B.', 'C'], ['B+', 'C'], ['B0', 'D'], ['B1', 'D'], ['B2', 'D'], ['B3', 'D'], ['B4', 'D'], ['B5', 'D'], ['B6', 'D'], ['B7', 'D']], [['B8', 'D'], ['B9', 'D'], ['B$', 'D'], ['B-', 'D'], ['B:', 'D'], ['B/', 'D'], ['B.', 'D'], ['B+', 'D'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A']], [['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'A'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B']], [['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'B'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C']], [['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D'], ['C', 'D']], [['C', 'D'], ['C', 'D'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'A'], ['D', 'B'], ['D', 'B']]];

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Sta001s
export function index(req, res) {
  return Sta001.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Sta001 from the DB
export function show(req, res) {
  return Sta001.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Sta001 in the DB
export function create(req, res) {
  return Sta001.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Sta001 in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Sta001.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Sta001 from the DB
export function destroy(req, res) {
  return Sta001.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// // Uploads a new Sta001
// export function upload(req, res) {
//   var o = {};
//   console.log(req.file);
//   var pdf_to_text = require('pdf-to-text');
//   pdf_to_text.info(req.file.path, function(err, info) {
//     console.log(info);
//   //   if (err) throw(err);
//   //   o.info = info;
//   //   pdf_to_text.pdfToText(req.file.path, function(err, data) {
//   //     if (err) throw(err);
//   //     o.data = data;
//   //     o.decode = decode(data);
//   //     console.log(JSON.stringify(o));
//   //     fs.writeFile(
//   //       req.file.path+'_decode.json', 
//   //       JSON.stringify(o),
//   //       function (err) {if (err) return console.log(err);}
//   //     );
//   //     return res.status(200).json(o.decode);
//   //   });
//   });
//   return res.status(200).json(o);
// }

// Uploads a new Sta001
export function upload(req, res) {
  console.log(req.file);
  pdfText(req.file.path, function(err, chunks) {
    console.log(JSON.stringify(chunks));
    fs.unlink(req.file.path, function (err) {
      if (err) throw err;
      console.log('successfully deleted /tmp/hello');
      return res.status(200).json(chunks);
    });
  })
}

// Custom decoding functions...
function decode(data) {
  var sta001s = [];
  var sta001 = {};
  var sta001res = {};
  sta001.i = {};
  var str = data.replace(/[ ]+/g, '');
  sta001.i.kitCode = str.substr(str.indexOf("REF") + 3, 5);
  str = str.substr(str.indexOf("REF") + 3 + 5);
  sta001.i.kitLot = str.substr(str.indexOf(sta001.i.kitCode) - 6, 6);
  sta001.i.kitExpiry = str.substr(str.indexOf(sta001.i.kitCode) + 5, 4);
  sta001res = getProductInfo(str, sta001);
  sta001 = getParameterInfo(str, sta001res);
  sta001s.push(sta001);
  var det = sta001.i.kitLot+sta001.i.kitCode+sta001.i.kitExpiry;
  var arr = str.split(det);
  if (arr.length > 2) {
    var sta002 = {};
    var sta002res = {};
    sta002.i = {};
    var str = str.substr(str.indexOf(det) + kitBarcodeEncodingCut + 1);
    var str2 = str.substr(str.indexOf(det) - 2);
    sta002.i.kitCode = sta001.i.kitCode;
    sta002.i.kitLot = sta001.i.kitLot;
    sta002.i.kitExpiry = sta001.i.kitExpiry;
    sta002res = getProductInfo(str2, sta002);
    sta002 = getParameterInfo(str2, sta002res);
    sta001s.push(sta002);
  }
  return sta001s;
}

function getProductInfo (data, sta001) {
  var str = data;
  var det = sta001.i.kitLot+sta001.i.kitCode+sta001.i.kitExpiry;
  var lines = [];
  var barcode = "";
  lines.push(str.substr(str.indexOf(det) - 2, kitBarcodeEncodingCut + 3));
  barcode = lines[0].substr(2, lines[0].length - 3);
  var linesLength = kitBarcodeDecoding.indexOf(lines[0].substr(0, 2));
  str = str.substr(str.indexOf(det) + kitBarcodeEncodingCut + 1);
  for (var i = 1; i < linesLength + 1; i++) {
    var startI = str.indexOf(kitBarcodeEncoding[linesLength][i][0]);
    var line = str.substr(startI, kitBarcodeEncodingCut + 3);
    var stopI = line.substr(2).indexOf(kitBarcodeEncoding[linesLength][i][1]) + 3;
    line = line.substr(0, stopI);
    lines.push(line);
    str = str.substr(startI+stopI);
    barcode = barcode + line.substr(2, line.length - 3);
  }
  sta001.i.productsCount = Number(barcode.charAt(det.length));
  sta001.i.productCodes = [];
  var res = barcode.substr(det.length + 1, barcode.length - det.length -3);
  for (var i = 0; i < sta001.i.productsCount; i++) {
    sta001.i.productCodes.push(res.substr(0, 5));
    res = res.substr(5);
  }
  var sta001res = [];
  sta001res.push(sta001);
  sta001res.push(res);
  return sta001res;
}

function getParameterInfo (data, sta001res) {
  var str = data;
  var sta001 = sta001res[0];
  var res = sta001res[1];
  sta001.i.parametersCount = 0;
  sta001.i.parameters = [];
  if (res == "") {
    return sta001;
  }
  if (str.indexOf("Etalonnage/AssayCalibration") > 0) {
    var caldata = str.substr(str.indexOf("Etalonnage/AssayCalibration"));
    caldata = caldata.substr(0, caldata.indexOf("\n\n\n\n"));
    caldata = caldata.replace(/[\n]+/g, '');
    var tmpArr = caldata.split(".");
    if (caldata.lastIndexOf("A0A1") > 0) {
      for (var i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i].indexOf("A0A1") > 0) break;
      }
      tmpArr[i] = tmpArr[i].replace("A1", "");
      for (var j = 0; j < tmpArr[i+1].length; j++) {
        if (!Number.isInteger(Number(tmpArr[i+1].charAt(j)))) break;
      }
      tmpArr[i+1] = tmpArr[i+1].substr(0, j)+"A1"+tmpArr[i+1].substr(j);
    }
    var calArr = [];
    calArr.push(tmpArr[0]);
    for (var i = 1; i < tmpArr.length; i++) {
      var lastPrevious = tmpArr[i-1].charAt(tmpArr[i-1].length - 1);
      var firstActual = tmpArr[i].charAt(0);
      if (Number.isInteger(Number(lastPrevious))) {
        calArr.push(tmpArr[i]);
      } else {
        break;
      }
    }
    for (var i = 1; i < 5; i++) {
      if (calArr[i-1].lastIndexOf("A"+(i-1)) > 0) {
        for (var j = 0; j < calArr[i].length; j++) {
          if (!Number.isInteger(Number(calArr[i].charAt(j)))) break;
        }
        sta001.i.parameters.push(calArr[i-1].substr(calArr[i-1].lastIndexOf("A"+(i-1))+2)+"."+calArr[i].substr(0, j));
        sta001.i.parametersCount += 1;
        if (0 == res.indexOf(sta001.i.parameters[sta001.i.parameters.length - 1].replace(".",""))) {
          res = res.substr(sta001.i.parameters[sta001.i.parameters.length - 1].length - 1);
        }
        // todo reduce res...
      }
    }
  }
  if (str.indexOf("ISI*") > 0) {
    var arr = str.split("ISI*");
    var isi = arr[1];
    isi = isi.substr(0, isi.indexOf("\n"));
    sta001.i.parameters.push(isi);
    sta001.i.parametersCount += 1;
    if (0 == res.indexOf(sta001.i.parameters[sta001.i.parameters.length - 1].replace(".",""))) {
      res = res.substr(sta001.i.parameters[sta001.i.parameters.length - 1].length - 1);
    }
  }
  if (res) {
    var concal = str;
    concal = concal.substr(concal.indexOf("Level"));
    concal = concal.substr(0, concal.indexOf("\n\n\n\n\n"));
    concal = concal.replace(/[\n]+/g, '');
    var arr = concal.split("STA");
    for (var i = 1; i < arr.length ; i++) {
      var startI = firstIndexOfType('num', 0, arr[i]);
      var stopI = firstIndexOfType('txt', startI, arr[i]);
      if (stopI != startI && stopI - startI < kitBarcodeEncodingCut -1) {
        sta001.i.parameters.push(arr[i].substr(startI, stopI - startI));
        sta001.i.parametersCount += 1;
        // todo reduce res...
        if (arr[i].charAt(stopI) == "-") {
          var startI2 = stopI + 1;
          var stopI2 = firstIndexOfType('txt', startI2, arr[i]);
          if (stopI2 != startI2) {
            sta001.i.parameters.push(arr[i].substr(startI2, stopI2 - startI2));
            sta001.i.parametersCount += 1;
            // todo reduce res...
          }
        }
      }
      if (arr[i].indexOf("NANA") > 0) {
        var fixStr = arr[i].substr(arr[i].indexOf("NANA"));
        var startIf = firstIndexOfType('num', 0, fixStr);
        var stopIf = firstIndexOfType('txt', startIf, fixStr);
        if (stopIf != startIf) {
          sta001.i.parameters.push(fixStr.substr(startIf, stopIf - startIf));
          sta001.i.parametersCount += 1;
          // todo reduce res...
          if (fixStr.charAt(stopIf) == "-") {
            var startIf2 = stopIf + 1;
            var stopIf2 = firstIndexOfType('txt', startIf2, fixStr);
            if (stopIf2 != startIf2) {
              sta001.i.parameters.push(fixStr.substr(startIf2, stopIf2 - startIf2));
              sta001.i.parametersCount += 1;
              // todo reduce res...
            }
          }
        }
      }
      var mis = arr[i].split("-");
      if (mis.length > 3) {
        if (arr[i].indexOf("NANA") < 0) {
          if (Number.isInteger(Number(mis[mis.length - 1].charAt(0)))) {
            if (Number.isInteger(Number(mis[mis.length - 2].charAt(mis[mis.length - 2].length - 1)))) {
              var fixIe = firstIndexOfType('txt', 0, mis[mis.length - 2].split("").reverse().join(""));
              sta001.i.parameters.push(mis[mis.length - 2].substr(mis[mis.length - 2].length - fixIe));
              sta001.i.parametersCount += 1;
              // todo reduce res...
              var fixIs = firstIndexOfType('txt', 0, mis[mis.length - 1]);
              sta001.i.parameters.push(mis[mis.length - 1].substr(0, fixIs));
              sta001.i.parametersCount += 1;
              // todo reduce res...
            }
          }
        }
      }
    }
  }
  return sta001;
}

function firstIndexOfType (typ, pos, str) {
  if (typ == 'num') {
    for (var index = pos; index < str.length; index++) {
      if (Number.isInteger(Number(str.charAt(index)))) break;
    }
    return index;
  }
  if (typ == 'txt') {
    for (var index = pos; index < str.length; index++) {
      if (!Number.isInteger(Number(str.charAt(index))) && str.charAt(index) != ".") break;
    }
    return index;
  }
}
