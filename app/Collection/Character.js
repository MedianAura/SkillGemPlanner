var Backbone = require("backbone");
var Character = require("../Model/Character");

var CharacterCollection = Backbone.Collection.extend({
    model: Character
});

module.exports = CharacterCollection;