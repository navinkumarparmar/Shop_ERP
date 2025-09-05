const express = require('express');
const apiroutes = express.Router();


const auth = require('./authRoutes');
const shop = require('./shopRoutes');
const product = require('./productRoutes');


apiroutes.use('/auth', auth);
apiroutes.use('/shops', shop);
apiroutes.use('/products', product);

module.exports = apiroutes;
