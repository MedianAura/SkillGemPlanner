/**
 * Created by Aura on 2017-03-11.
 */

var Backbone = require("backbone");
var nunjucks = require("nunjucks");
var lodash = require("lodash");

require("bootstrap");

var CharacterModel = require("../Model/Character");
var ItemController = require("../Controller/ItemController");
var ItemModel = require("../Model/Item");

var DialogEditGems = Backbone.View.extend({
    id: "ModalEditItem",
    sTemplate: "DialogEditGems/main.twig",
    oItem: null,
    events: {
        "click #AppListGems button": "addGem",
        "hide.bs.modal #ModalEditItem": "closeDialog",
        "click .btnRemoveGem": "removeGem",
        "keyup .formNewGemName": "searchGemsEvent"
    },

    initialize: function (options) {
        this.render();
        $("#DialogContent").append(this.$el);
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate));
    },

    updateItemView: function () {
        this.$el.find("#AppItem").html(nunjucks.render("DialogEditGems/ItemEditor.twig", {model: this.oItem.model}));
    },

    updateGemList: function (aGems) {
        this.$el.find("#AppListGems").html(nunjucks.render("DialogEditGems/ListGems.twig", {gems: aGems}));
    },

    show: function (oItem) {
        this.oItem = oItem;

        this.oItem.model.get("gems").on("update", this.updateItemView, this);
        this.oItem.model.get("gems").on("change", this.updateItemView, this);

        this.updateItemView();
        this.updateGemList(oMainApp.aGems);

        this.$el.find(".modal").modal('show');
    },

    closeDialog: function (e) {
        this.undelegateEvents();
        this.oItem = null;
    },

    searchGemsEvent: lodash.throttle(function (e) {
        e.preventDefault();
        var value = $(e.target).val();
        if (value.length > 0) {
            this.searchGems(value);
        } else {
            this.searchGems(null);
        }
        return false;
    }, 1000),

    searchGems: function (value) {
        var result = [];

        if (!lodash.isNull(value)) {
            var findByValue = lodash.partial(this.findGems, value);
            result = lodash.filter(oMainApp.aGems, findByValue);
        } else {
            result = oMainApp.aGems;
        }

        this.updateGemList(result);
    },

    findGems: function (value, oGems) {
        if (oGems.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return oGems;
        }
    },

    addGem: function (e) {
        e.preventDefault();
        var $btn = $(e.target).closest("button");
        var data = $btn.data("gem");

        this.oItem.addGem(data);

        $btn.blur();
        return false;
    },

    removeGem: function (e) {
        e.preventDefault();

        var $sel = $(e.target).closest(".btn-move");
        var id = $sel.data("ndx");
        var gems = this.oItem.model.get("gems").at(id);
        if (!lodash.isUndefined(gems)) {
            this.oItem.model.get("gems").remove(gems);
        }

        return false;
    }
});

module.exports = new DialogEditGems();
