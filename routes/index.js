const express = require('express');
const { getProductList, getProductDetail } = require('../controller/index.controller');
const router = express.Router();


router
  .get('/', getProductList)
  .get('/:id', getProductDetail)

module.exports = router;
