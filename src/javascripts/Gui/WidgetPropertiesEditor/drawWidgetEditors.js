/**
 * Internal function that helps to draw widget editor list
 */

import utils from '../../utils'
import SingleFieldEditor from '../SingleFieldEditor'

export default function drawWidgetEditors(widget, editorPool){

    let $weditor;

    let widgetDef = widget.widgetDefinition;
    let properties = widgetDef.config.properties || [];

    $weditor = $('<div/>');

    for(let i = 0; i<properties.length; i++){
        let property = properties[i];

        let name = property.name;
        let label = property.label || name;



        let $editorRow = $('<div class="veol-editor-row" />');

        //Label
        $editorRow.append($(`<label>${label}</label>`));

        // Editor
        let $editor = drawEditorField(property, widget, $editorRow, editorPool);

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

    return $weditor;
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

/**
 * Add a checkbox and logic required for nullable properties
 * @param property
 * @param $editor
 * @param widget
 */
function bindNullable(property, $editor, widget){
    let $nullableCb = $('<input type="checkbox"/>');

    $nullableCb.insertBefore($editor);

    let propertyIsNull = widget.data[property.name] === undefined || widget.data[property.name] === null;
    if(propertyIsNull){
        $editor.hide();
    } else {
        $nullableCb.attr('checked', true);
    }

    // on checkbox state change, we forward the info to the application (but we do not change the layout yet)
    $nullableCb.on('change', function(){

        let nullBackup = widget.application.getWidgetEditorProperty(widget, 'nullBackup');
        nullBackup = nullBackup || {};

        if(this.checked){

            let value;
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


function drawEditorField(property, widget, $editorRow, editorPool) {

    let editor = utils.getPropertyEditor(property, editorPool);

    if(property.useDedicatedEditor || !editor.isLiveEdit() || editor.hasEditionHandler()){

        let $editButton = $('<div class="veol-dedicated-editor-button">Editer</div>');

        if(editor.hasEditionHandler()){
            // The editor has defined its own method to edit the field
            $editButton.click(function(){
                editor.config.editionHandler(widget, property);
            });
        } else {
            // If dedicated editor is enabled we show the editor in a popup
            let singleFieldEditor = new SingleFieldEditor(widget, property);

            $editButton.click(function(){
                singleFieldEditor.show();
            });
        }

        $editorRow.append($editButton);
        return $editButton;

    } else {
        // Else we show the inline editor

        let $editor = editor.createEditor(widget, property);
        $editorRow.append($editor);
        editor.afterDraw($editor, widget, property);
        return $editor;
    }
}
