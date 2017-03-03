var Backbone = require("backbone");
var Gems = require("../Model/Gem");

var GemCollection = Backbone.Collection.extend({
    model: Gems
});

module.exports = GemCollection;