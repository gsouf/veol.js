import utils from "./utils"
import EditorPool from "./Gui/WidgetPropertiesEditor/PropertyEditorPool"
import ConfirmBox from "./Gui/ConfirmBox"
import VeolError from './Error'

class Application {

    /**
     *
     * @param {PageMaker} pageMaker
     * @param {object} data
     */
    constructor(pageMaker, data){

        if(null === data || typeof data !== 'object'){
            throw new VeolError(VeolError.ERR_INVALID_DATA, 'Veol data should be an object')
        } else if(Object.keys(data).length === 0){
            throw new VeolError(VeolError.ERR_INVALID_DATA, 'Veol data cannot be empty')
        } else  if(!data.hasOwnProperty('widgetName')){
            throw new VeolError(
                VeolError.ERR_INVALID_DATA,
                'the given data do not appear to be a valid widget (no widget name was provided for the root element)'
            )
        }

        this.pageMaker = pageMaker;
        this.originalData = data;
        this.data = pageMaker.parseData(data, this, null);
        this.selectedWidget = [];

        this.yesNo = new ConfirmBox();
    }

    /**
     * Get a serialized version of the data
     * @returns {*}
     */
    save(){
        return this.data.helper.save();
    }

    /**
     * refresh the inner data
     */
    reload(){
        var data = this.save();
        this.data = pageMaker.parseData(data, this, null);
    }

    deleteWidget(widget){
        var i = widget.parent.children.indexOf(widget);
        if(i>0){
            widget.parent.children.splice(i, 1);
        }
        this.dispatchEvent('widgetDeleted', [widget]);
    }

    /**
     * Set the widget in a selected state and adds it to the list of selected widget.
     * Typically a widget is selected when the user clicks it
     * @param widget
     */
    selectWidget(widget){
        this.selectedWidget.push(widget);
        this.dispatchEvent('widgetSelected', [widget]);
    }


    /**
     * Unselect all widget previously selected
     */
    unselectAllWidgets(){
        this.selectedWidget = [];
        this.dispatchEvent('unselectAllWidgets', []);
    }

    /**
     * update a data of a widget
     * @param widget
     * @param propertyName
     * @param value
     * @param eventData data to pass to the event
     */
    updateWidgetData (widget, propertyName, value, eventData) {
        this.getWidget(widget).data[propertyName] = value;
        this.dispatchEvent('widgetDataEdited', [widget, propertyName, value], eventData);
        widget.dispatchEvent('dataEdited', [propertyName, value], eventData);
    }

    /**
     * Set a value in the widget meta
     * @param widget
     * @param metaName
     * @param value
     * @param eventData data to pass to the event
     */
    updateWidgetMeta(widget, metaName, value, eventData) {
        this.getWidget(widget).meta[metaName] = value;
        this.dispatchEvent('widgetMetaEdited', [widget, metaName, value], eventData);
        widget.dispatchEvent('metaEdited', [metaName, value], eventData);
    }

    /**
     * Set a value in the widget editor properties
     * @param widget
     * @param name
     * @param value
     * @param eventData data to pass to the event
     */
    updateWidgetEditorProperty(widget, name, value, eventData) {
        this.getWidget(widget).editor[name] = value;
        this.dispatchEvent('widgetEditorPropertyEdited', [widget, name, value], eventData);
        widget.dispatchEvent('editorPropertyEdited', [name, value], eventData);
    }

    /**
     * Get an editor property for the given widget
     * @param widget
     * @param name
     * @returns {*}
     */
    getWidgetEditorProperty(widget, name) {
        return this.getWidget(widget).editor[name];
    }


    getWidget(widget){
        if(typeof widget === "object"){
            return widget;
        } else {
            throw 'Unable to find a widget by id: not implemented yet';
            // TODO by id
        }
    }

    createWidget(data, widgetDef, parentWidget){
        var widget = this.pageMaker.parseData(widgetData, this, inWidget);

        if(inWidget){
            inWidget.children.push(widget);
        }

        this.dispatchEvent('widgetCreated', [widget]);
    }

}

utils.makeObservable(Application);

export default Application;
