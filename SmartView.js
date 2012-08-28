var SmartView = Backbone.View.extend({

    modelClass: Backbone.Model,

    model: null,

    selector: null,

    templateDelimeters: {
        unescaped: {
            open: "<%=",
            close: "%>"
        },

        escaped: {
            open: "<%-",
            close: "%>"
        }
    },

    initialize: function(options) {
        this._parseOptions(options);

        var attrs = this._parseFragment();
        this._createModel(attrs);
    },

    render: function() {
        if (!this.template) {
            this._createTemplate();
        }
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    _parseFragment: function() {
        var attrs = {};
        this.$("[data-attr]").each(function() {
            attrs[$(this).data('attr')] = $(this).text();
        });

        return attrs;
    },

    _createTemplate: function() {
        var $fragment = this.$el.clone();

        var self = this;
        $fragment.find('[data-attr]').each(function() {
            if ($(this.data('escaped'))) {
                $(this).text(self.templateDelimeters.escaped.open + " " + $(this).data('attr') + " " + self.templateDelimeters.escaped.close);
            } else {
                $(this).text(self.templateDelimeters.unescaped.open + " " + $(this).data('attr') + " " + self.templateDelimeters.unescaped.close);
            }
        });

        this.template = _.template($fragment.html().replace(/\&lt\;\%/g, "<%").replace(/\%\&gt\;/g, "%>"));
    },

    _createModel: function(attrs) {
        this.model = new this.modelClass(attrs);

        this._bindEvents();

        this.trigger("ready", this.model);
    },

    _parseOptions: function(options) {
        if (options.selector) {
            this.selector = options.selector;
        }

        if (options.modelClass) {
            this.modelClass = options.modelClass;
        }

        if (options.templateDelimeters) {
            this.templateDelimeters = options.templateDelimeters;
        }
    },

    _bindEvents: function() {
        if (this.model) {
            this.model.on("change", function() {
                this.render();
            }, this);
        }
    }
});