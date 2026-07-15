// Central export file for all Mongoose models
const Product = require('./Product');
const Category = require('./Category');
const Service = require('./Service');
const Hero = require('./Hero');
const Settings = require('./Settings');

module.exports = {
    Product,
    Category,
    Service,
    Hero,
    Settings
};
