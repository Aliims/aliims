'use strict';

import mongoose from 'mongoose';

var Sta001Schema = new mongoose.Schema({
  i: {
    kitCode: String,
    kitLot: String,
    kitExpiry: String,
    parametersCount: Number,
    productsCount: Number,
    parameters: Array,
    productCodes: Array
  },
  o: {
  	parameters: Array,
  	productBarcodes: Array,
  	kitBarcodeLines: Array,
    kitBarcode: String
  },
  updated: { type: Date, default: Date.now },
  valid: { type: Boolean, default: true },
  online: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

export default mongoose.model('Sta001', Sta001Schema);
