var Backbone = require("backbone");
var nunjucks = require("nunjucks");

var CharacterModel = require("../Model/Character");
var ItemController = require("../Controller/ItemController");
var lodash = require("lodash");

var CharacterController = Backbone.View.extend({
    el: "#CharacterContent",
    sTemplate: "CharacterView.twig",
    oItems: {},
    events: {
        "click .btnAddItem": "addItem",
        "submit form": "addItem"
    },

    initialize: function () {
        this.model = new CharacterModel();
        this.render();
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate, {model: this.model.toJSON()}));
    },

    addItem: function (e) {
        e.preventDefault();
        var slot = this.$el.find("[name=itemSlot]").val();
        var slot_id = "ItemSlot_" + slot;

        if (!lodash.isEmpty(slot) && lodash.isUndefined(this.oItems[slot_id])) {
            this.oItems[slot_id] = new ItemController({id: slot_id, slot: slot, oParent: this});
            this.$el.find("#ItemList").append(this.oItems[slot_id].$el);
        } else {
            alert("Un nom doit être donnée pour l'item.");
        }

        return false;
    }
});

module.exports = CharacterController;