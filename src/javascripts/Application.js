import utils from "./utils"
import EditorPool from "./Gui/WidgetPropertiesEditor/PropertyEditorPool"
import ConfirmBox from "./Gui/ConfirmBox"

class Application {

    /**
     *
     * @param {PageMaker} pageMaker
     * @param {object} data
     */
    constructor(pageMaker, data){
        this.pageMaker = pageMaker;
        this.originalData = data;
        this.data = pageMaker.parseData(data, this, null);
        this.selectedWidget = [];

        this.editorPool = new EditorPool({
            loadDefaults: true
        });

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
     */
    updateWidgetData (widget, propertyName, value) {
        this.getWidget(widget).data[propertyName] = value;
        this.dispatchEvent('widgetDataEdited', [widget, propertyName, value]);
        widget.dispatchEvent('dataEdited', [propertyName, value]);
    }

    /**
     * Set a value in the widget meta
     * @param widget
     * @param metaName
     * @param value
     */
    updateWidgetMeta(widget, metaName, value) {
        this.getWidget(widget).meta[metaName] = value;
        this.dispatchEvent('widgetMetaEdited', [widget, metaName, value]);
        widget.dispatchEvent('metaEdited', [metaName, value]);
    }

    /**
     * Set a value in the widget editor properties
     * @param widget
     * @param name
     * @param value
     */
    updateWidgetEditorProperty(widget, name, value) {
        this.getWidget(widget).editor[name] = value;
        this.dispatchEvent('widgetEditorPropertyEdited', [widget, name, value]);
        widget.dispatchEvent('editorPropertyEdited', [name, value]);
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
