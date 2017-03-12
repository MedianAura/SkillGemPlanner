const Backbone = require("backbone");
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const sprintf = require("sprintf").sprintf;

nunjucks.configure(path.resolve(__dirname, "./View/").replace(/\\/gmi, "/") + "/");

var CharacterController = require("./Controller/Character");
var lodash = require("lodash");

var MainApp = Backbone.View.extend({
    el: "#MainContent",
    sTemplate: "Main.twig",
    reloadData: false,
    sFilePath: null,
    sDefaultPath: null,
    aFilters: [],
    aGems: [],
    oChar: null,

    initialize: function () {
        const {remote} = require('electron');
        const {Menu, MenuItem} = remote;

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        if (!this.reloadData) {
            this.aGems = require("./GemsData/gems.json");
        } else {
            this.getGemsData();
        }

        var sHomeDir = require("os").homedir();
        this.sDefaultPath = path.resolve(sHomeDir, ".\\Document\\my games\\PoE Skill Gem Planner\\");
        fse.ensureDirSync(this.sDefaultPath);

        this.aFilters.push({name: 'PoE Skill Planner', extensions: ['chr']});

        var oChar = {};
        this.render();
        this.oChar = new CharacterController({model: oChar});
    },

    render: function () {
        this.$el.html(nunjucks.render(this.sTemplate));
    },

    setCharacter: function (oChar) {
        this.oChar.setModel(oChar);
    },

    saveCharacter: function () {
        if (!lodash.isNull(this.sFilePath)) {
            fse.writeJsonSync(this.sFilePath, this.oChar.model.toJSON(), {encoding: "utf8"});
        } else {
            this.saveAsCharacter();
        }
    },

    saveAsCharacter: function () {
        const {dialog} = require('electron').remote;
        var sFilePath = dialog.showSaveDialog({defaultPath: this.sDefaultPath, filters: this.aFilters});
        if (!lodash.isUndefined(sFilePath)) {
            fse.writeJsonSync(sFilePath, this.oChar.model.toJSON(), {encoding: "utf8"});
            this.sFilePath = sFilePath;
        }
    },

    loadCharacter: function () {
        const {dialog} = require('electron').remote;
        var sFilePath = dialog.showOpenDialog({
            properties: ['openFile'],
            defaultPath: this.sDefaultPath,
            filters: this.aFilters
        });

        if (!lodash.isUndefined(sFilePath)) {
            var oChar = fse.readJsonSync(sFilePath[0], {encoding: "utf8"});
            this.sFilePath = sFilePath[0];
            this.setCharacter(oChar);
        }
    },

    newCharacter: function () {
        this.sFilePath = null;
        this.setCharacter({});
    },

    getGemsData: function () {
        var self = this;

        const glob = require("glob");
        const path = require("path");
        const fse = require("fs-extra");

        var aFiles = glob.sync(sprintf("%s/GemsData/*.txt", __dirname));

        lodash.each(aFiles, function (value) {
            var sColor = path.basename(value, ".txt");
            if (sColor.indexOf("-passive") > -1) {
                sColor = sColor.replace("-passive", "");
            }

            var sContent = fs.readFileSync(value, {encoding: "utf8"});
            var html = $.parseHTML(sContent);
            var $html = $(html);

            $html.find("tr").each(function () {
                var $data = $(this).find("td").eq(0).find("a");
                var img = $data.eq(0).find("img").prop("src");
                var name = $data.eq(1).text();

                self.aGems.push({
                    image: img,
                    type: sColor,
                    name: name
                });
            });
        });

        fse.writeJsonSync(sprintf("%s/GemsData/gems.json", __dirname), self.aGems, {encoding: "utf8"});
    }
});

module.exports = MainApp;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                click: function () {
                    oMainApp.newCharacter();
                }
            },
            {
                label: 'Load',
                click: function () {
                    oMainApp.loadCharacter();
                }
            },
            {
                label: 'Save',
                click: function () {
                    oMainApp.saveCharacter();
                }
            },
            {
                label: 'Save As',
                click: function () {
                    oMainApp.saveAsCharacter();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: function () {
                    require('electron').shell.openExternal('http://electron.atom.io')
                }
            }
        ]
    }
];
