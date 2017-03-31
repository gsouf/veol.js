import WidgetWidgetList from "./Widgets/widget-list"
import Application from "./Application"
import utils from "./utils"
import EditorPool from './Gui/WidgetPropertiesEditor/PropertyEditorPool'

var widgetInstanceId = 10000;

var PageMaker = function(){
    this.widgets = {};

    this.editorPool = new EditorPool({
        loadDefaults: true
    });

    this.addWidgetDefinition("widget-list", new WidgetWidgetList());
};

PageMaker.prototype.addWidgetDefinition = function(name, widget){
    this.widgets[name] = widget;
};

/**
 * Find a widget by its name among the internally registered widgets
 * @param name
 * @returns {*}
 */
PageMaker.prototype.findWidgetDefinition = function(name){
    var widget = this.widgets[name];
    if(!widget){
        throw 'No widget named ' + name + ' was found';
    }else{
        return widget;
    }
};

/**
 * Parse input data to associate a widget definition to widget data
 * @param data
 */
PageMaker.prototype.parseData = function(data, application, parent = null){
    var newData = {};

    // TODO: provide a deep copy of data.data
    newData.data = data.data || {};
    newData.meta = data.meta || {};
    newData.editor = data.editor || {};
    newData.wid = widgetInstanceId++;
    newData.parent = parent;
    newData.application = application;

    utils.makeObservable(newData, true);


    if(data.widgetName){
        newData.widgetName = data.widgetName;
        newData.widgetDefinition = this.findWidgetDefinition(data.widgetName);

        newData.helper = {
            save: function () {
                return newData.widgetDefinition.onSave(newData);
            }
        };

        if(newData.widgetDefinition.isContainer()){
            if(data.children && data.children.length>0){
                newData.children = [];
                for(let c in data.children){
                    if(data.children.hasOwnProperty(c)) {
                        newData.children[c] = this.parseData(data.children[c], application, newData);
                    }
                }
            }else{
                newData.children = [];
            }
        }
    }

    return newData;
};

/**
 * Creates an application with the given data
 * @param data
 * @returns {Application}
 */
PageMaker.prototype.createApplication = function(data){
    return new Application(this, data);
};

export default PageMaker;
