var Backbone = require("backbone");
var Item = require("../Model/Item");

var ItemCollection = Backbone.Collection.extend({
    model: Item
});

module.exports = ItemCollection;