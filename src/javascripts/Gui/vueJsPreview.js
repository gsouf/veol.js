export default function vueJsPreview (options) {

    let previewOptions = {};

    if (options.template) {
        previewOptions.onCreateContentContainer = function ($content, widget) {
            let $block = $(options.template);
            $content.append($block);

            let properties = widget.widgetDefinition.config.properties;
            for (var i in properties) {
                if (!widget.data.hasOwnProperty(properties[i].name)) {
                    widget.data[properties[i].name] = null;
                }
            }

            let vueOptions = options.vueOptions || {};
            vueOptions.el = $block[0];
            vueOptions.data = widget.data;

            new Vue(vueOptions);
        }

    }

    return previewOptions;
};
