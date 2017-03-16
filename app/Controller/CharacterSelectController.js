/**
 * Created by Aura on 2017-03-15.
 */

const Backbone = require("backbone");
const fs = require("fs");
const path = require("path");
const lodash = require("lodash");

const CharacterSelectController = Backbone.View.extend({
    el: "#CharacterPanel",
    events: {
        "contextmenu": "openContextMenuEvent"
    },

    /**
     * @constructor
     */
    initialize: function () {
        var sHomeDir = require("os").homedir();
        var sDir = path.resolve(sHomeDir, ".\\Document\\my games\\PoE Skill Gem Planner\\");

        console.log(sDir);
        var aFiles = fs.readdirSync(sDir);
        lodash.each(aFiles, function (sFile) {
            console.log(fs.statSync(sDir + "\\" + sFile).isDirectory());
        });
    },

    openContextMenuEvent: function (e) {
        e.preventDefault();

        const {remote} = require('electron')
        const {Menu, MenuItem} = remote

        const menu = new Menu()
        menu.append(new MenuItem({label: 'MenuItem1', click: function() { console.log('item 1 clicked') }}));

        menu.popup(remote.getCurrentWindow());

        var $sel = $(e.target).closest(".app-character-folder");
        var data = $sel.data();
        console.log($sel, data);

        return false;
    }
});

module.exports = CharacterSelectController;