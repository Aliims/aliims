'use strict';

var express = require('express');
var multer = require('multer');
var upload = multer({ dest: './upload/sta001/' });
var controller = require('./sta001.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/upload/', upload.single('file'), controller.upload);

module.exports = router;
