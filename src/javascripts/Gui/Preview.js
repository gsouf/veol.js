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



        widgetRefreshPreview($child, widget);

        for(var i = 0; i < widget.children.length; i++){
            drawWidget(preview, widget.children[i], $subParent);
        }


    } else {
        var $innerData = $(`<div class="veol-preview-content"></div>`);
        $innerData.appendTo($child);

        widgetRefreshPreview($child, widget);
    }

}

function widgetRefreshPreview($child, widget){
    var preview = widget.widgetDefinition.config.preview;
    if(preview && preview.onDataChange){
        var $innerData = $child.find('.veol-preview-content').first();
        preview.onDataChange($child, $innerData, widget);
    }
}


class Preview{

    constructor(application){
        this.$root = $(
            `<div 
                class="veol-preview"
            />`
        );
        this.$device = $(
            `<div class="veol-device-wrapper">
                <div class="veol-device-top"></div>
                <div class="veol-device-screen"></div>
                <div class="veol-device-bottom"></div>
            </div>`
        );
        this.$header = $(
            `<div class="veol-toolbox-header" >
                <ul>                    
                    <li class="veol-list-inline">
                        <div class="veol-label">Device:</div>
                        <div class="veol-list-choices">
                            <ul>
                                <li class="device-button veol-active" data-device="small">
                                    <i class="fa fa-mobile fa-fw"></i>
                                </li>
                                <li class="device-button" data-device="medium">
                                    <i class="fa fa-tablet fa-fw"></i>
                                </li>
                                <li class="device-button" data-device="large">
                                    <i class="fa fa-laptop fa-fw"></i>
                                </li>
                                <li class="device-button" data-device="xlarge">
                                    <i class="fa fa-desktop fa-fw"></i>
                                </li>
                            </ul>
                        </div>
                    </li>
                    
                
                    
                    <li class="veol-fill"></li>
                </ul>
            </div>`
        );

        this.$screen = this.$device.find('.veol-device-screen');
        this.$root.append(this.$header);
        this.$root.append(this.$device);



        this.application = application;

        this.draw();

        this.setDevice('small');

        var self = this;


        // bind top menu device mode
        this.$header.find('.device-button').click(function(){
            var device = $(this).attr('data-device');
            self.setDevice(device);
        });


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
            widgetRefreshPreview(self.$root.find(`[data-wid=${widget.wid}]`), widget);
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
        this.$root.addClass(`veol-device-${device}`);
        this.$root.attr('veol-device', device);

        // Update the active button
        this.$header.find('.device-button.veol-active').removeClass('veol-active');
        this.$header.find(`.device-button[data-device=${device}]`).addClass('veol-active');
    }

}

export default Preview;
