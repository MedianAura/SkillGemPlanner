var Backbone = require("backbone");
var nunjucks = require("nunjucks");

var ItemModel = require("../Model/Item");
var GemModel = require("../Model/Gem");
var lodash = require("lodash");

var ItemController = Backbone.View.extend({
    sTemplate: "ItemView.twig",
    className: "ItemView",
    oParent: null,
    model: null,
    events: {
        "click .btnRemoveGem": "removeGem",
        "click .btn-move": "changeStatus"
    },

    initialize: function (options) {
        this.oParent = options.oParent;

        this.model.get("gems").on("update", this.render, this);
        this.model.get("gems").on("change", this.render, this);

        this.render();
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate, {model: this.model}));

        if (this.model.get("gems").length == 6) {
            this.$el.find(".btnAddGem").hide();
        }
    },

    addGem: function (oGem) {
        if (this.model.get("gems").length < 6) {
            this.model.get("gems").add(new GemModel(oGem));
        } else {
            alert("Can't have more than 6 Gems in an Item.");
        }
    },

    removeGem: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".btn-move");
        var id = $sel.data("ndx");
        var gems = this.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            this.model.get("gems").remove(gems);
        }

        return false;
    },

    changeStatus: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".btn-move");
        var id = $sel.data("ndx");
        var gems = this.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            if (gems.get("enable")) {
                gems.set("enable", false);
            } else {
                gems.set("enable", true);
            }
        }

        return false;
    }
});

module.exports = ItemController;