export default function vueJsPreview (options) {

    let previewOptions = {};

    if (options.template) {
        previewOptions.onCreateContentContainer = function ($content, widget) {
            let $block = $(options.template);
            $content.append($block);

            new Vue({
                el: $block[0],
                data: widget.data
            })
        }

    }

    return previewOptions;
};
