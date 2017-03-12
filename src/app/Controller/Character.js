var Backbone = require("backbone");
var nunjucks = require("nunjucks");
var lodash = require("lodash");

require("bootstrap");

var CharacterModel = require("../Model/Character");
var ItemController = require("../Controller/ItemController");
var ItemModel = require("../Model/Item");
var DialogEditGems = require("./DialogEditGems");

var CharacterController = Backbone.View.extend({
    el: "#CharacterContent",
    sTemplate: "CharacterView.twig",
    oItems: {},
    dialogId: null,
    events: {
        "click #ItemList .ItemView": "openDialog",
        "click .btnAddItem": "addItemEvent",
        "submit form": "addItemEvent"
    },

    initialize: function (options) {
        if (!lodash.isUndefined(options.model)) {
            this.model = new CharacterModel(options.model);
        } else {
            this.model = new CharacterModel();
        }

        this.render();
    },

    setModel: function (oChar) {
        this.model = new CharacterModel(oChar);
        this.render();
    },

    render: function () {
        var self = this;
        this.$el.html(nunjucks.render(this.sTemplate));

        lodash.each(this.oItems, function (oItem) {
            oItem.remove();
            oItem = null;
        });
        this.oItems = {};

        if (this.model.get("items").length > 0) {
            lodash.each(this.model.get("items").models, function (value) {
                self.addItem(value.get("slot"), value)
            });
        }
    },

    addItem: function (slot, model) {
        var slot_id = "ItemSlot_" + slot;

        if (!lodash.isEmpty(slot) && lodash.isUndefined(this.oItems[slot_id])) {
            this.oItems[slot_id] = new ItemController({id: slot_id, model: model, oParent: this});
            this.$el.find("#ItemList").append(this.oItems[slot_id].$el);
        } else {
            alert("Un nom doit être donnée pour l'item.");
        }
    },

    removeItem: function (oItem) {
        this.model.get("items").remove(oItem);
        this.render();
    },

    addItemEvent: function (e) {
        e.preventDefault();
        var slot = this.$el.find("[name=itemSlot]").val();

        var model = new ItemModel({slot: slot});
        this.model.get("items").add(model);
        this.addItem(slot, model);

        this.$el.find("[name=itemSlot]").val("");
        return false;
    },

    openDialog: function (e) {
        e.preventDefault();
        var id = $(e.target).closest(".ItemView").prop("id");
        DialogEditGems.show(this.oItems[id]);
        return false;
    },
});

module.exports = CharacterController;