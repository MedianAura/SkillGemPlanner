var Backbone = require("backbone");

var Gems = Backbone.RelationalModel.extend({
    defaults: {
        type: "blank",
        name: "",
        btnClass: "btn-default",
        enable: true,
        edit: false
    },

    getButton: function () {
        switch (this.get("type").toLowerCase()) {
            case "red":
                this.set("btnClass", "btn-danger");
                return this.get("btnClass");
                break;
            case "green":
                this.set("btnClass", "btn-success");
                return this.get("btnClass");
                break;
            case "blue":
                this.set("btnClass", "btn-primary");
                return this.get("btnClass");
                break;
            case "blank":
                this.set("btnClass", "btn-default");
                return this.get("btnClass");
                break;
            default:
                this.set("btnClass", "btn-default");
                return this.get("btnClass");
                break;
        }
    }
});

module.exports = Gems;