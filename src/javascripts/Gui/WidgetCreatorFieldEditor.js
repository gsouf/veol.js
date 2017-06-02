import utils from '../utils';
import drawWidgetEditors from './WidgetPropertiesEditor/drawWidgetEditors'

export default class WidgetCreatorFieldEditor{

    /**
     *
     * @param application application to create a widget for
     * @param widgetName name of the widget definition
     * @param parent perent widget (optional)
     */
    constructor(application, widgetName){
        let widgetDef = application.pageMaker.findWidgetDefinition(widgetName);

        this.application = application;
        this.widgetDef = widgetDef;
        this.widgetName = widgetName;
    }

    create(parent, success, cancel){

        let data = {
            widgetName: this.widgetName,
            data: {}
        };

        let properties = this.widgetDef.config.properties;

        // If no property just return the widget with empty data
        if(!properties){
            success(this.application.pageMaker.parseData(data, this.application, parent));
            return;
        }

        // Find default values
        for(let i = 0; i < properties.length; i++){
            if(properties[i].hasOwnProperty("defaultValue")){
                data.data[properties[i].name] = properties[i].defaultValue;
            }
        }

        // Create widget with default values
        let newWidget = this.application.pageMaker.parseData(data, this.application, parent);

        let title = this.widgetDef.config.title || this.widgetName;

        // Create modal
        let $modalRoot = this.$root = $(`
          <div class="veol-modal veol-modal-widget-fields-creation">
            <div class="veol-modal-background"></div>
            <div class="veol-modal-display-area veol-controls">
                <div class="veol-modal-header">
                    <div class="veol-modal-title">Creation d'un widget: ${title}</div>
                </div>
                <div class="veol-modal-content"></div>
                <div class="veol-modal-footer">
                    <div veol-close class="veol-button veol-button-cancel">Annuler</div>
                    <div class="veol-button veol-button-validate">Valider</div>
                </div>
            </div>         
          </div>
        `);

        utils.bindModal($modalRoot, function(){
            if(cancel){
                cancel(this);
            }
            $modalRoot.empty();
            $modalRoot.remove();
        });


        // Create editors
        let $editors = drawWidgetEditors(newWidget, this.application.pageMaker.editorPool);
        $editors.addClass('veol-property-editor');

        $modalRoot.find('.veol-modal-content').append($editors);


        $modalRoot.find('.veol-button-validate').click(function(){
            if(success){
                success(newWidget);
                $modalRoot.empty();
                $modalRoot.remove();
            }
        });

        // Show modal
        $('body').append($modalRoot);
    }



}
