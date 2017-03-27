import utils from './utils';

class WidgetDefinition {

    onSave(widget) {
        var data = {
            widgetName: widget.widgetName
        };

        if(this.isContainer()){
            data.children = [];
            for(var c in widget.children){
                if(widget.children.hasOwnProperty(c)) {
                    data.children.push(widget.children[c].helper.save());
                }
            }
        }

        if(widget.data && Object.getOwnPropertyNames(widget.data).length > 0){
            data.data = widget.data;
        }

        if(widget.meta && Object.getOwnPropertyNames(widget.meta).length > 0){
            data.meta = widget.meta;
        }

        if(widget.editor && Object.getOwnPropertyNames(widget.editor).length > 0){
            data.editor = widget.editor;
        }

        return data;
    }

    isContainer() {
        return this.config.isContainer === true;
    }


    /**
     * Check if the given widget is acceptable as a child of this widget
     * @param widget
     * @returns {*}
     */
    allowedAsChild(widget) {
        let types;
        if(widget.widgetDefinition) {
            types = widget.widgetDefinition.config.types;
        }else{
            types = widget.config.types;
        }
        return utils.whitelistBlacklistChecker(this.config.childrenWhitelist, this.config.childrenBlacklist, types);
    }

    /**
     * Check if the given widget is acceptable as a parent of this widget
     * @param widget
     * @returns {*}
     */
    allowedAsParent(widget) {
        let types;
        if(widget.widgetDefinition) {
            types = widget.widgetDefinition.config.types;
        }else{
            types = widget.config.types;
        }
        return utils.whitelistBlacklistChecker(this.config.parentWhitelist, this.config.parentBlacklist, types);
    }

}

/**
 * @param {Object} config
 * @param {boolean} [config.isContainer=false] true if the widget is a container. A container will accept children widget
 * @param {Array} [config.types=[]] types are used for widget child/parent acceptance.
 * See childrenWhiteList, childrenBlacklist, parentWhiteList and parentBlackList options
 * @param {Array} [config.childrenWhitelist] allowed children. By default all children are allowed.
 * @param {Array} [config.childrenBlacklist] forbidden children. By default all children no child is forbidden.
 * @param {Array} [config.parentWhitelist] allowed parents. By default all parents are allowed.
 * @param {Array} [config.parentBlacklist] forbidden parents. By default all children no parent is forbidden.
 *
 * @param {boolean} [config.preview] array of callbacks that can be called during rendering
 * @param {boolean} [config.preview.onCreateContainer] called when the container dom element is created
 * but not populated yet. This method is called only when config.isContainer is set to true.
 * @param {boolean} [config.preview.afterCreateContainer] called after the container dom element is created
 * and populated. This method is called only when config.isContainer is set to true.
 * @param {boolean} [config.preview.onPreview] called when the preview dom element is created
 * but not populated yet, only when config.isContainer is false
 * @param {boolean} [config.preview.onCreateOuter] called when the outer div containing the element is created
 *
 * @returns {WidgetDefinition} createdWidget
 */
WidgetDefinition.create = function(config){
    config = config || {};
    var Widget_ =  function(){
        this.config = config;
        this.config.data = this.config.data || {};
    };
    Widget_.prototype = Object.create(WidgetDefinition.prototype);
    return Widget_;
};

WidgetDefinition.fastInstance = function(config){
    var widget = WidgetDefinition.create(config);
    return new widget();
};

export default WidgetDefinition;
