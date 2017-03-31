import EditorPool from './WidgetPropertiesEditor/PropertyEditorPool';
import utils from '../utils';
import SingleFieldEditor from './SingleFieldEditor';
import Component from './Component';

/**
 *
 * @param {WidgetPropertiesEditor} propertyEditor
 * @param {Object} widget
 */
function drawWidget(propertyEditor, widget){

    propertyEditor.$propertiesWrapper.children().hide();

    var $weditor;


    if (propertyEditor.__editorCache.hasOwnProperty(widget.wid)) {
        $weditor = propertyEditor.__editorCache[widget.wid];
        $weditor.show();
    } else {
        var widgetDef = widget.widgetDefinition;
        var properties = widgetDef.config.properties || [];

        $weditor = $('<div/>');

        for(var i = 0; i<properties.length; i++){
            var property = properties[i];

            var name = property.name;
            var label = property.label || name;



            var $editorRow = $('<div class="veol-editor-row" />');

            //Label
            $editorRow.append($(`<label>${label}</label>`));

            // Editor
            var $editor = createEditorField(property, widget, $editorRow, propertyEditor);
            $editorRow.append($editor);


            // Tooltip
            if(property.tooltip){
                $editorRow.append(`<span class="veol-tooltip veol-tooltip-help-icon" data-tooltip="${property.tooltip}"></span>`);
            }

            // Nullable
            if(property.nullable){
                bindNullable(property, $editor, widget);
            }

            // ShowIf
            if (property.showIf) {
               bindShowIf(property, $editorRow, widget)
            }

            // Append to the group
            $weditor.append($editorRow);

        }
        propertyEditor.__editorCache[widget.wid] = $weditor;
        propertyEditor.$propertiesWrapper.append($weditor);
    }

}

function bindShowIf(property, $editor, widget) {
    widget.addEventListener('dataEdited', function(){
        if (property.showIf(widget.data)) {
            $editor.removeClass('veol-hide');
        } else {
            $editor.addClass('veol-hide');
        }
    });

    // Initialize
    if(!property.showIf(widget.data)){
        $editor.addClass('veol-hide');
    }
}

function createEditorField(property, widget, $editorRow, propertyEditor) {

    var editor = utils.getPropertyEditor(property, propertyEditor.editorPool);

    if(property.useDedicatedEditor || !editor.isLiveEdit() || editor.hasEditionHandler()){

        var $editButton = $('<div class="veol-dedicated-editor-button">Editer</div>');

        if(editor.hasEditionHandler()){
            // The editor has defined its own method to edit the field
            $editButton.click(function(){
                editor.config.editionHandler(widget, property);
            });
        } else {
            // If dedicated editor is enabled we show the editor in a popup
            var singleFieldEditor = new SingleFieldEditor(widget, property);

            $editButton.click(function(){
                singleFieldEditor.show();
            });
        }

        return $editButton;

    } else {
        // Else we show the inline editor

        var $editor = editor.createEditor(widget, property);
        return $editor;
    }
}

/**
 * Add a checkbox and logic required for nullable properties
 * @param property
 * @param $editor
 * @param widget
 */
function bindNullable(property, $editor, widget){
    var $nullableCb = $('<input type="checkbox"/>');

    $nullableCb.insertBefore($editor);

    var propertyIsNull = widget.data[property.name] === undefined || widget.data[property.name] === null;
    if(propertyIsNull){
        $editor.hide();
    } else {
        $nullableCb.attr('checked', true);
    }

    // on checkbox state change, we forward the info to the application (but we do not change the layout yet)
    $nullableCb.on('change', function(){

        var nullBackup = widget.application.getWidgetEditorProperty(widget, 'nullBackup');
        nullBackup = nullBackup || {};

        if(this.checked){

            var value;
            if(nullBackup[property.name]){
                value = nullBackup[property.name];
            } else if (property.defaultIfNull) {
                value = property.defaultIfNull;
            } else {
                value = ''
            }

            widget.application.updateWidgetData(widget, property.name, value);
        } else {
            // Backup the current value to be able to find it latter
            nullBackup[property.name] = widget.data[property.name];
            widget.application.updateWidgetEditorProperty(widget, 'nullBackup', nullBackup);

            // Set the value to null
            widget.application.updateWidgetData(widget, property.name, null);
        }
    });

    // When the widget data is edited we might show or hide the editor depending on whether the value is null or not
    widget.addEventListener('dataEdited', function(propertyName, value){
        if(propertyName == property.name){
            if(value !== null){
                $editor.show();
                $nullableCb.prop('checked', true);
            } else {
                $nullableCb.prop('checked', false);
                $editor.hide();
            }
        }
    });

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
