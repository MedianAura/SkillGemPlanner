var Backbone = require("backbone");
require('backbone-relational');

var GemCollection = require("../Collection/Gem");
var Gem = require("./Gem");

var Item = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'gems',
        relatedModel: Gem,
        collectionType: GemCollection,
        reverseRelation: {
            key: 'oItem'
        }
    }],
    defaults: {
        "gems": null
    }
});

module.exports = Item;