var Backbone = require("backbone");
var nunjucks = require("nunjucks");

var ItemModel = require("../Model/Item");
var GemModel = require("../Model/Gem");
var lodash = require("lodash");

var ItemController = Backbone.View.extend({
    sTemplate: "ItemView.twig",
    oParent: null,
    model: null,
    sort: null,
    events: {
        "click .btnAddGem": "addGem",
        "click .btnSaveGem": "saveGem",
        "click .btnRemoveGem": "removeGem",
        "click .btnEditGem": "editGem"
    },

    initialize: function (options) {
        this.oParent = options.oParent;
        this.model = new ItemModel({slot: options.slot});
        this.model.get("gems").on("update", this.render, this);
        this.model.get("gems").on("change", this.render, this);

        this.render();
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate, {model: this.model}));

        if (this.model.get("gems").length == 6) {
            this.$el.find(".btnAddGem").hide();
        }

        this.updateSort();
    },

    updateSort: function () {
        var Sortable = require("sortablejs");

        this.sort = Sortable.create(this.$el.find(".ItemGemsList").get(0), {
            group: "gems",
            handle: ".btn-move",
            filter: ".btnRemoveGem, .btnEditGem"
        });
    },

    addGem: function (e) {
        e.preventDefault();
        if (this.model.get("gems").length < 6) {
            this.model.get("gems").add(new GemModel({edit: true}));
        }
        return false;
    },

    saveGem: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".row");
        var id = $sel.data("ndx");

        var gems = this.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            var color = $sel.find("[name=gemColor]").val();
            var name = $sel.find("[name=gemName]").val();

            gems.set("type", color);
            gems.set("name", name);
            gems.set("edit", false);
        }

        return false;
    },

    removeGem: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".btn-move");
        var id = $sel.data("ndx");
        var gems = this.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            this.model.get("gems").remove(gems);
            this.$el.find(".btnAddGem").show();
        }

        return false;
    },

    editGem: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".btn-move");
        var id = $sel.data("ndx");
        var gems = this.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            gems.set("edit", true);
        }

        return false;
    }
});

module.exports = ItemController;