var Backbone = require("backbone");
var nunjucks = require("nunjucks");
var path = require("path");
var fs = require("fs");

nunjucks.configure(path.resolve(__dirname, "./View/").replace(/\\/gmi, "/") + "/");

var CharacterController = require("./Controller/Character");

var MainApp = Backbone.View.extend({
    el: "#MainContent",
    sTemplate: "Main.twig",

    initialize: function () {
        this.render();
        this.setCharacter();
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate));
    },

    setCharacter: function (e) {
        new CharacterController();
    },

    getGemsData: function () {
        var sContent = fs.readFileSync("D:\\WebServer\\vhost\\Node\\SkillGemPlanner\\app\\GemsData\\red.txt", {encoding: "utf8"});
        var html = $.parseHTML(sContent);
        var $html = $(html);

        var aRedGems = [];
        $html.find("tr").each(function () {
            var $data = $(this).find("td").eq(0).find("a");
            var img = $data.eq(0).find("img").prop("src");
            var name = $data.eq(1).text();

            aRedGems.push({
                image: img,
                name: name
            });
        });

        console.log(aRedGems);
    }
});

module.exports = MainApp;
