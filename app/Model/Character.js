var Backbone = require("backbone");
require('backbone-relational');

var ItemCollection = require("../Collection/Item");
var Item = require("./Item");

var Character = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'items',
        relatedModel: Item,
        collectionType: ItemCollection,
        reverseRelation: {
            key: 'oChar'
        }
    }],
    defaults: {
        "items": null
    },

    initialize: function () {
    }
});

module.exports = Character;