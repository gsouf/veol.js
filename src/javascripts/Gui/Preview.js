import Component from './Component'
import utils from '../utils'
import ToolboxBar from './ToolboxBar'
import PreviewDeviceSwitch from './ToolboxAction/PreviewDeviceSwitch'

/**
 *
 * @param {Preview} oreview
 * @param {Object} widget
 * @param {WidgetDefinition} [widget.widgetDefinition]
 * @param {jQuery} $parent
 */
function drawWidget(preview, widget, $parent){
    var widgetDef = widget.widgetDefinition;
    var isContainer = widgetDef.isContainer();
    var $child = $(
        `<div class="veol-preview-widget" data-wid="${widget.wid}"/>`
    );

    var previewProperties = widgetDef.config.preview || {};

    if(previewProperties.onCreateOuter){
        previewProperties.onCreateOuter($child, widget);
    }

    $child.appendTo($parent);

    // Associate widget with the dom element
    $child.data('widget-instance', widget);

    if (isContainer) {
        // Container classes
        $child.addClass('veol-is-container');

        // Children
        var $subParent = $(`<div class="veol-preview-content veol-preview-children"/>`);
        $subParent.appendTo($child);

        if(previewProperties.onCreateContainer){
            previewProperties.onCreateContainer($subParent, widget);
        }



        widgetRefreshPreview($child, widget, {});

        for(var i = 0; i < widget.children.length; i++){
            drawWidget(preview, widget.children[i], $subParent);
        }


    } else {
        var $innerData = $(`<div class="veol-preview-content"></div>`);
        $innerData.appendTo($child);
        if(previewProperties.onCreateContentContainer){
            previewProperties.onCreateContentContainer($innerData, widget);
        }

        widgetRefreshPreview($child, widget, {});
    }

}

function widgetRefreshPreview($child, widget, event){
    var preview = widget.widgetDefinition.config.preview;
    if(preview && preview.onDataChange){
        var $innerData = $child.find('.veol-preview-content').first();

        if($innerData.length > 0){
            preview.onDataChange($child, $innerData, widget, event);
        }
    }
}


class Preview extends Component{

    constructor(application, options){
        super();

        options = options || {};

        this.$root.addClass('veol-preview');

        this.$device = $(
            `<div class="veol-device-wrapper">
                <div class="veol-device-top"></div>
                <div class="veol-device-screen"></div>
                <div class="veol-device-bottom"></div>
            </div>`
        );


        var defaultDeviceMove = options.hasOwnProperty('deviceMode') ?  options.deviceMode : 'small';


        /// TOP BAR
        if(options.hasOwnProperty('topBar')){
            this.topBar = options.topBar;
        } else {
            this.topBar = new ToolboxBar();
            if(defaultDeviceMove !== false){
                this.topBar.append(new PreviewDeviceSwitch(this));
            }
        }
        if(this.topBar){
            this.$root.append(this.topBar.$root);
        }

        this.$screen = this.$device.find('.veol-device-screen');
        this.$root.append(this.$device);

        this.application = application;

        this.draw();

        this.setDevice(defaultDeviceMove);

        var self = this;



        application.addEventListener('widgetMoved', function(movedWidget, target, operationType){
            var $target = self.$root.find(`[data-wid=${target.wid}]`);
            var $moved = self.$root.find(`[data-wid=${movedWidget.wid}]`);
            switch(operationType){
                case 'inside':
                    $moved.appendTo($target.find('.veol-preview-children').first());
                    break;
                case 'after':
                    $moved.insertAfter($target);
                    break;
                case 'before':
                    $moved.insertBefore($target);
                    break;
                default:
                    console.error(`unknown operation type ${operationType}`)
            }
        });

        application.addEventListener('widgetDeleted', function(widget){
            self.$root.find(`[data-wid=${widget.wid}]`).remove();
        });

        application.addEventListener('widgetAdded', function(widget){
            var parentId = widget.parent.wid;

            var $into;


            // if the parent is the first parent (root of the data) then we add it to the $screen directly
            // because the root element is not included in the preview
            if(parentId == application.data.wid){
                $into = self.$screen;
            } else {
                $into = self.$root.find(`[data-wid=${parentId}]`)
                $into = $into.children('.veol-preview-children').first();
            }


            drawWidget(self, widget, $into);
        });

        application.addEventListener('widgetSelected', function(widget){
            self.$root.find(`[data-wid=${widget.wid}]`).addClass('veol-widget-selected');
        });

        application.addEventListener('unselectAllWidgets', function(){
            self.$root.find('.veol-widget-selected').removeClass('veol-widget-selected');
        });

        application.addEventListener('widgetDataEdited', function(widget, property, value){
            widgetRefreshPreview(self.$root.find(`[data-wid=${widget.wid}]`), widget, this);
        });
    }

    draw(){
        this.$screen.empty();

        var data = this.application.data;

        for(var i = 0; i < data.children.length; i++){
            drawWidget(this, data.children[i], this.$screen);
        }
    }

    /**
     * The the device mode for preview
     * @param device
     */
    setDevice(device){
        this.deviceMode = device;

        // Update the preview class
        var currentDevice = this.$root.attr('veol-device');
        if(currentDevice) {
            this.$root.removeClass(`veol-device-${currentDevice}`);
        }

        if(device){
            this.$root.addClass(`veol-device-enabled veol-device-${device}`);
        } else {
            this.$root.removeClass(`veol-device-enabled`);
        }

        this.$root.attr('veol-device', device);
        this.dispatchEvent('deviceChanged', [device, currentDevice]);
    }

}


utils.makeObservable(Preview);

export default Preview;
