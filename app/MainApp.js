var Backbone = require("backbone");
var nunjucks = require("nunjucks");
var path = require("path");

nunjucks.configure(path.resolve(__dirname, "./app/View/").replace(/\\/gmi, "/") + "/");

var MainApp = Backbone.View.extend({
    el: "#MainContent",
    sTemplate: "Main.twig",

    initialize: function () {

    },

    changeView: function (e) {

    }
});

module.exports = MainApp;
