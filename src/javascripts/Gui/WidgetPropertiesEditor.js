import EditorPool from './WidgetPropertiesEditor/PropertyEditorPool';
import utils from '../utils';
import SingleFieldEditor from './SingleFieldEditor';
import Component from './Component';
import drawWidgetEditors from './WidgetPropertiesEditor/drawWidgetEditors';

/**
 *
 * @param {WidgetPropertiesEditor} propertyEditor
 * @param {Object} widget
 */
function drawWidget(propertyEditor, widget){

    propertyEditor.$propertiesWrapper.children().hide();
    let $weditor;

    if (propertyEditor.__editorCache.hasOwnProperty(widget.wid)) {
        $weditor = propertyEditor.__editorCache[widget.wid];
        $weditor.show();
    } else {
        $weditor = drawWidgetEditors(widget, propertyEditor.editorPool);
        propertyEditor.__editorCache[widget.wid] = $weditor;
        propertyEditor.$propertiesWrapper.append($weditor);
    }

}



class WidgetPropertiesEditor extends Component{

    constructor(application){
        super();
        this.__editorCache = {};

        this.$root.addClass('veol-property-editor veol-controls veol-toolbox');
        this.$root.append($(
            `<div class="veol-toolbox-header">
                <ul>
                    <li class="veol-title">Propriétés</li>
                </ul>
            </div>`
        ));

        this.$propertiesWrapper = $(`<div class="veol-properties-wrapper"></div>`);
        this.$root.append(this.$propertiesWrapper);



        this.application = application;
        this.editorPool = application.pageMaker.editorPool;


        var self = this;


        application.addEventListener('widgetDeleted', function(widget){
            self.$propertiesWrapper.children().hide();
            // TODO delete cached version
        });
        application.addEventListener('widgetSelected', function(widget){
            drawWidget(self, widget);
        });
        application.addEventListener('unselectAllWidgets', function(widget){
            self.$propertiesWrapper.children().hide();
        });
    }
}

export default WidgetPropertiesEditor;
