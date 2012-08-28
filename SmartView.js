var SmartView = Backbone.View.extend({

    modelClass: Backbone.Model,

    model: null,

    selector: null,

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

        $fragment.find('[data-attr]').each(function() {
            $(this).text('<%= ' + $(this).data('attr') + ' %>');
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
    },

    _bindEvents: function() {
        if (this.model) {
            this.model.on("change", function() {
                this.render();
            }, this);
        }
    }
});